const db = require("../models");
const { QueryTypes } = require("sequelize");

// ========================================
// GET /api/aircond — ดึงเครื่องแอร์ทั้งหมด
// ========================================
exports.findAll = async (req, res) => {
  try {
    const data = await db.sequelize.query(
      `
      SELECT 
        id, seq_no, floor, room, location,
        asset_number, brand, btu,
        install_date, age_years,
        refrigerant_type, inspection_result,
        inspector, remark
      FROM air_conditioners
      ORDER BY floor, id ASC
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
// GET /api/aircond/floor/:floor — แยกตามชั้น
// ========================================
exports.findByFloor = async (req, res) => {
  try {
    const { floor } = req.params;
    const data = await db.sequelize.query(
      `
      SELECT * FROM air_conditioners
      WHERE floor = :floor
      ORDER BY id ASC
    `,
      {
        replacements: { floor },
        type: QueryTypes.SELECT,
      },
    );

    return res.status(200).json({ success: true, total: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/aircond/summary — สรุปตามชั้น
// ========================================
exports.summary = async (req, res) => {
  try {
    const data = await db.sequelize.query(
      `
      SELECT 
        floor AS ชั้น,
        COUNT(*) AS จำนวนเครื่อง,
        COUNT(DISTINCT brand) AS จำนวนยี่ห้อ
      FROM air_conditioners
      GROUP BY floor
      ORDER BY floor ASC
    `,
      { type: QueryTypes.SELECT },
    );

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
