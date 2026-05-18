const db = require("../models");
const { QueryTypes } = require("sequelize");
const asset_items = db.asset_items;
// GET /api/asset-items — ดึงทั้งหมด
exports.findAll = async (req, res) => {
  try {
    const data = await db.sequelize.query(
      `SELECT * FROM asset_items 
       WHERE status != 'delete' 
       ORDER BY id ASC`,
      { type: QueryTypes.SELECT },
    );
    return res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/asset-items/:id
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.sequelize.query(
      `SELECT * FROM asset_items WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT },
    );
    if (!data.length)
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูล" });
    return res.status(200).json({ success: true, data: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/asset-items — เพิ่มใหม่
exports.create = async (req, res) => {
  try {
    const clean = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k, v === "" ? null : v]),
    );
    const {
      department_unit,
      asset_name,
      description,
      asset_no_main,
      budget_type,
      budget_year,
      asset_code,
      supply_or_assets,
      custodian,
      status,
      storage_department,
      receive_date,
      remark,
    } = clean;

    // เช็คเลขซ้ำ
    let isDuplicate = false;
    if (asset_no_main) {
      const existing = await asset_items.findOne({
        where: { asset_no_main },
      });
      if (existing) isDuplicate = true;
    }

    // สร้าง asset_no_sub อัตโนมัติ
    const countResult = await db.sequelize.query(
      `SELECT COUNT(*) as cnt FROM asset_items 
       WHERE asset_code = :code AND budget_year = :year`,
      {
        replacements: { code: asset_code, year: budget_year },
        type: QueryTypes.SELECT,
      },
    );
    const cnt = parseInt(countResult[0].cnt) + 1;
    const asset_no_sub = `${asset_code}${budget_year}${String(cnt).padStart(4, "0")}`;

    // ถ้าซ้ำ → ติด flag ใน status และ remark
    const finalStatus = isDuplicate ? "duplicate" : status || "active";
    const finalRemark = isDuplicate
      ? `⚠️ เลขครุภัณฑ์ซ้ำกับรายการที่มีอยู่แล้ว${remark ? ` | ${remark}` : ""}`
      : remark;

    await db.sequelize.query(
      `INSERT INTO asset_items
        (department_unit, asset_name, description, asset_no_main,
         budget_type, budget_year, asset_code, supply_or_assets,
         custodian, status, storage_department, asset_no_sub,
         receive_date, remark, created_at, updated_at)
      VALUES
        (:department_unit, :asset_name, :description, :asset_no_main,
         :budget_type, :budget_year, :asset_code, :supply_or_assets,
         :custodian, :status, :storage_department, :asset_no_sub,
         :receive_date, :remark, NOW(), NOW())`,
      {
        replacements: {
          department_unit: department_unit || "ฝ่ายพัฒนาระบบสารสนเทศ",
          asset_name,
          description,
          asset_no_main,
          budget_type: budget_type || "001 เงินงบแผ่นดิน",
          budget_year,
          asset_code,
          supply_or_assets: supply_or_assets || "Assets",
          custodian,
          status: finalStatus,
          storage_department: storage_department || "ฝ่ายพัฒนาระบบสารสนเทศ",
          asset_no_sub,
          receive_date: receive_date || null,
          remark: finalRemark,
        },
        type: QueryTypes.INSERT,
      },
    );

    // แจ้ง Frontend ว่าซ้ำหรือไม่
    return res.status(201).json({
      success: true,
      isDuplicate,
      message: isDuplicate
        ? `⚠️ บันทึกสำเร็จ แต่เลขครุภัณฑ์ ${asset_no_main} ซ้ำกับรายการที่มีอยู่แล้ว`
        : "เพิ่มครุภัณฑ์สำเร็จ",
      asset_no_sub,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/asset-items/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const clean = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k, v === "" ? null : v]),
    );
    const {
      department_unit,
      asset_name,
      description,
      asset_no_main,
      budget_type,
      budget_year,
      asset_code,
      supply_or_assets,
      custodian,
      status,
      storage_department,
      receive_date,
      remark,
    } = clean;

    // เช็คว่าเลขใหม่ซ้ำกับรายการอื่นไหม (ยกเว้นตัวเอง)
    let finalStatus = status;
    let finalRemark = remark;

    if (asset_no_main) {
      const duplicate = await db.sequelize.query(
        `SELECT id FROM asset_items 
         WHERE asset_no_main = :asset_no_main 
         AND id != :id`,
        { replacements: { asset_no_main, id }, type: QueryTypes.SELECT },
      );

      if (duplicate.length > 0) {
        // ยังซ้ำอยู่ → คง status เป็น duplicate
        finalStatus = "duplicate";
        finalRemark = `⚠️ เลขครุภัณฑ์ซ้ำกับรายการที่มีอยู่แล้ว${remark ? ` | ${remark}` : ""}`;
      } else {
        // ไม่ซ้ำแล้ว → คืน status กลับเป็น active
        finalStatus = status === "duplicate" ? "active" : status;
        finalRemark = remark?.startsWith("⚠️") ? null : remark;
      }
    }

    await db.sequelize.query(
      `
      UPDATE asset_items SET
        department_unit    = :department_unit,
        asset_name         = :asset_name,
        description        = :description,
        asset_no_main      = :asset_no_main,
        budget_type        = :budget_type,
        budget_year        = :budget_year,
        asset_code         = :asset_code,
        supply_or_assets   = :supply_or_assets,
        custodian          = :custodian,
        status             = :status,
        storage_department = :storage_department,
        receive_date       = :receive_date,
        remark             = :remark,
        updated_at         = NOW()
      WHERE id = :id
    `,
      {
        replacements: {
          id,
          department_unit,
          asset_name,
          description,
          asset_no_main,
          budget_type,
          budget_year,
          asset_code,
          supply_or_assets,
          custodian,
          status: finalStatus,
          storage_department,
          receive_date: receive_date || null,
          remark: finalRemark,
        },
        type: QueryTypes.UPDATE,
      },
    );

    return res.status(200).json({
      success: true,
      message:
        finalStatus === "duplicate"
          ? "⚠️ บันทึกสำเร็จ แต่เลขครุภัณฑ์ยังซ้ำอยู่"
          : "แก้ไขสำเร็จ",
      isDuplicate: finalStatus === "duplicate",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/asset-items/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.sequelize.query(
      `
      UPDATE asset_items
      SET status = 'delete',
          updated_at = NOW()
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.UPDATE,
      },
    );

    return res
      .status(200)
      .json({ success: true, message: "ลบสำเร็จ (soft delete)" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/asset-items/search/:keyword
exports.search = async (req, res) => {
  try {
    const { keyword } = req.params;
    const data = await db.sequelize.query(
      `
      SELECT * FROM asset_items
      WHERE asset_name    ILIKE :kw OR
            custodian     ILIKE :kw OR
            asset_no_main ILIKE :kw OR
            asset_no_sub  ILIKE :kw OR
            asset_code    ILIKE :kw
      ORDER BY id ASC
    `,
      { replacements: { kw: `%${keyword}%` }, type: QueryTypes.SELECT },
    );
    return res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.test = (req, res) => {
  const asset = req.params.an;
  const data = asset_items.findOne({
    where: { asset_no_main: asset },
  });
  res.status(200).send(data);
};

// GET /api/asset-items/problems — ดึงรายการที่มีปัญหา
exports.findProblems = async (req, res) => {
  try {
    const data = await db.sequelize.query(
      `SELECT * FROM asset_items 
       WHERE status = 'duplicate' 
       ORDER BY updated_at DESC`,
      { type: QueryTypes.SELECT },
    );
    return res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
