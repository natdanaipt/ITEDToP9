const db = require("../models");
const { QueryTypes } = require("sequelize");

// ========================================
// GET /api/assets — ดึงครุภัณฑ์ทั้งหมด
// ========================================
exports.findAll = async (req, res) => {
  try {
    const assets = await db.sequelize.query(`
      SELECT
        a.id,
        a.asset_id,
        a.asset_name,
        a.description,
        a.unit,
        a.price_per_unit,
        a.quantity,
        a.acquisition_type,
        a.acquisition_date,
        a.expiry_date,
        a.status,
        a.photos,
        a.remark,
        ac.category_name_th  AS category,
        al.room              AS location_room,
        al.building          AS location_building,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS custodian_name,
        d.department_name_th AS department
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id  = ac.id
      LEFT JOIN asset_locations  al ON a.location_id  = al.id
      LEFT JOIN users             u ON a.custodian_id = u.id
      LEFT JOIN departments       d ON a.department_id = d.id
      ORDER BY a.id ASC
    `, { type: QueryTypes.SELECT });

    return res.status(200).json({
      success: true,
      total: assets.length,
      data: assets,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/assets/:id — ดึงครุภัณฑ์รายชิ้น
// ========================================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.sequelize.query(`
      SELECT
        a.*,
        ac.category_name_th  AS category,
        al.room              AS location_room,
        al.building          AS location_building,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS custodian_name,
        d.department_name_th AS department
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id  = ac.id
      LEFT JOIN asset_locations  al ON a.location_id  = al.id
      LEFT JOIN users             u ON a.custodian_id = u.id
      LEFT JOIN departments       d ON a.department_id = d.id
      WHERE a.id = :id
    `, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบครุภัณฑ์" });
    }

    return res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// POST /api/assets — เพิ่มครุภัณฑ์ใหม่
// ========================================
exports.create = async (req, res) => {
  try {
    const {
      asset_id, asset_id_old, asset_name, description,
      unit, price_per_unit, quantity, category_id,
      acquisition_type, acquisition_date, useful_life_years,
      expiry_date, status, location_id, custodian_id,
      photos, department_id, remark, created_by,
    } = req.body;

    // เช็คว่า asset_id ซ้ำไหม
    const existing = await db.sequelize.query(
      `SELECT id FROM assets WHERE asset_id = :asset_id`,
      { replacements: { asset_id }, type: QueryTypes.SELECT }
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "รหัสครุภัณฑ์นี้มีอยู่แล้ว" });
    }

    await db.sequelize.query(`
      INSERT INTO assets (
        asset_id, asset_id_old, asset_name, description,
        unit, price_per_unit, quantity, category_id,
        acquisition_type, acquisition_date, useful_life_years,
        expiry_date, status, location_id, custodian_id,
        photos, department_id, remark, created_by,
        data_updated_at, created_at, updated_at
      ) VALUES (
        :asset_id, :asset_id_old, :asset_name, :description,
        :unit, :price_per_unit, :quantity, :category_id,
        :acquisition_type, :acquisition_date, :useful_life_years,
        :expiry_date, :status, :location_id, :custodian_id,
        :photos, :department_id, :remark, :created_by,
        NOW(), NOW(), NOW()
      )
    `, {
      replacements: {
        asset_id, asset_id_old, asset_name, description,
        unit, price_per_unit, quantity: quantity || 1,
        category_id, acquisition_type, acquisition_date,
        useful_life_years, expiry_date,
        status: status || "active",
        location_id, custodian_id,
        photos: JSON.stringify(photos || []),
        department_id, remark, created_by,
      },
      type: QueryTypes.INSERT,
    });

    return res.status(201).json({ success: true, message: "เพิ่มครุภัณฑ์สำเร็จ" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// PUT /api/assets/:id — แก้ไขครุภัณฑ์
// ========================================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      asset_name, description, unit, price_per_unit,
      quantity, category_id, acquisition_type, acquisition_date,
      useful_life_years, expiry_date, status,
      location_id, custodian_id, photos, remark,
    } = req.body;

    await db.sequelize.query(`
      UPDATE assets SET
        asset_name       = :asset_name,
        description      = :description,
        unit             = :unit,
        price_per_unit   = :price_per_unit,
        quantity         = :quantity,
        category_id      = :category_id,
        acquisition_type = :acquisition_type,
        acquisition_date = :acquisition_date,
        useful_life_years = :useful_life_years,
        expiry_date      = :expiry_date,
        status           = :status,
        location_id      = :location_id,
        custodian_id     = :custodian_id,
        photos           = :photos,
        remark           = :remark,
        data_updated_at  = NOW(),
        updated_at       = NOW()
      WHERE id = :id
    `, {
      replacements: {
        id, asset_name, description, unit, price_per_unit,
        quantity, category_id, acquisition_type, acquisition_date,
        useful_life_years, expiry_date, status,
        location_id, custodian_id,
        photos: JSON.stringify(photos || []),
        remark,
      },
      type: QueryTypes.UPDATE,
    });

    return res.status(200).json({ success: true, message: "แก้ไขครุภัณฑ์สำเร็จ" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// DELETE /api/assets/:id — ลบครุภัณฑ์
// ========================================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.sequelize.query(
      `SELECT id FROM assets WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบครุภัณฑ์" });
    }

    await db.sequelize.query(
      `DELETE FROM assets WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.DELETE }
    );

    return res.status(200).json({ success: true, message: "ลบครุภัณฑ์สำเร็จ" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};