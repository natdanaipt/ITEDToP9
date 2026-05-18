const db = require("../models");
const { QueryTypes } = require("sequelize");

// ========================================
// GET /api/itassets — ดึงครุภัณฑ์ IT ทั้งหมด
// ========================================
exports.findAll = async (req, res) => {
  try {
    const data = await db.sequelize.query(
      `
      SELECT 
        id, seq_no, asset_type,
        receive_date, description,
        custodian, asset_number, remark
      FROM it_assets
      ORDER BY id ASC
    `,
      { type: QueryTypes.SELECT },
    );

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/itassets/custodian/:name — ค้นหาตามผู้ถือครอง
// ========================================
exports.findByCustodian = async (req, res) => {
  try {
    const { name } = req.params;
    const data = await db.sequelize.query(
      `
      SELECT * FROM it_assets
      WHERE custodian ILIKE :name
      ORDER BY id ASC
    `,
      {
        replacements: { name: `%${name}%` },
        type: QueryTypes.SELECT,
      },
    );

    return res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/itassets/search/:keyword — ค้นหาทั่วไป
// ========================================
exports.search = async (req, res) => {
  try {
    const { keyword } = req.params;
    const data = await db.sequelize.query(
      `
      SELECT * FROM it_assets
      WHERE 
        asset_type    ILIKE :kw OR
        description   ILIKE :kw OR
        custodian     ILIKE :kw OR
        asset_number  ILIKE :kw OR
        remark        ILIKE :kw
      ORDER BY id ASC
    `,
      {
        replacements: { kw: `%${keyword}%` },
        type: QueryTypes.SELECT,
      },
    );

    return res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/itassets/summary — สรุปตามประเภท
// ========================================
exports.summary = async (req, res) => {
  try {
    const data = await db.sequelize.query(
      `
      SELECT 
        custodian AS ผู้ถือครอง,
        COUNT(*) AS จำนวนรายการ
      FROM it_assets
      WHERE custodian IS NOT NULL
      GROUP BY custodian
      ORDER BY จำนวนรายการ DESC
    `,
      { type: QueryTypes.SELECT },
    );

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
