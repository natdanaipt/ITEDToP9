const db = require("../models");
const { QueryTypes } = require("sequelize");
const { logAction } = require("./audit_log.controller");

// ========================================
// GET /api/inspections — ดึงการตรวจสอบทั้งหมด
// ========================================
exports.findAll = async (req, res) => {
  try {
    const rows = await db.sequelize.query(`
      SELECT
        ai.id,
        ai.inspection_year,
        ai.inspection_date,
        ai.physical_count,
        ai.system_count,
        ai.is_matched,
        ai.status_found,
        ai.note,
        a.asset_id,
        a.asset_name,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS inspected_by_name
      FROM annual_inspection ai
      LEFT JOIN assets a ON ai.asset_id = a.id
      LEFT JOIN users  u ON ai.inspected_by = u.id
      ORDER BY ai.inspection_year DESC, ai.id DESC
    `, { type: QueryTypes.SELECT });

    return res.status(200).json({ success: true, total: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/inspections/year/:year — ดึงตามปี
// ========================================
exports.findByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const rows = await db.sequelize.query(`
      SELECT
        ai.id,
        ai.inspection_date,
        ai.physical_count,
        ai.system_count,
        ai.is_matched,
        ai.status_found,
        ai.note,
        a.asset_id,
        a.asset_name,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS inspected_by_name
      FROM annual_inspection ai
      LEFT JOIN assets a ON ai.asset_id = a.id
      LEFT JOIN users  u ON ai.inspected_by = u.id
      WHERE ai.inspection_year = :year
      ORDER BY ai.id DESC
    `, { replacements: { year }, type: QueryTypes.SELECT });

    return res.status(200).json({ success: true, total: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// POST /api/inspections — บันทึกการตรวจสอบ (scan QR)
// ========================================
exports.create = async (req, res) => {
  try {
    const {
      asset_id, inspection_year, inspection_date,
      inspected_by, physical_count, system_count,
      status_found, note,
    } = req.body;

    const is_matched = physical_count === system_count;

    await db.sequelize.query(`
      INSERT INTO annual_inspection
        (asset_id, inspection_year, inspection_date,
         inspected_by, physical_count, system_count,
         is_matched, status_found, note, created_at)
      VALUES
        (:asset_id, :inspection_year, :inspection_date,
         :inspected_by, :physical_count, :system_count,
         :is_matched, :status_found, :note, NOW())
    `, {
      replacements: {
        asset_id, inspection_year,
        inspection_date: inspection_date || new Date(),
        inspected_by, physical_count, system_count,
        is_matched, status_found, note,
      },
      type: QueryTypes.INSERT,
    });

    // บันทึก Audit Log
    await logAction(
      inspected_by, "CREATE", "annual_inspection",
      asset_id, null,
      { asset_id, inspection_year, status_found },
      req
    );

    return res.status(201).json({ success: true, message: "บันทึกการตรวจสอบสำเร็จ" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/inspections/scan/:qr_code — scan QR แล้วดึงข้อมูล
// ========================================
exports.scanQR = async (req, res) => {
  try {
    const { qr_code } = req.params;

    const asset = await db.sequelize.query(`
      SELECT
        a.id, a.asset_id, a.asset_name, a.status,
        a.description, a.unit, a.price_per_unit,
        a.acquisition_date, a.expiry_date,
        a.photos, a.remark,
        ac.category_name_th AS category,
        al.room, al.building,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS custodian_name
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id  = ac.id
      LEFT JOIN asset_locations  al ON a.location_id  = al.id
      LEFT JOIN users             u ON a.custodian_id = u.id
      WHERE a.qr_code = :qr_code OR a.asset_id = :qr_code
    `, { replacements: { qr_code }, type: QueryTypes.SELECT });

    if (asset.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบครุภัณฑ์" });
    }

    return res.status(200).json({ success: true, data: asset[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};