const db = require("../models");
const { QueryTypes } = require("sequelize");

// ลบบรรทัดนี้ออก ❌
// const users = db.users;

exports.findAll = async (req, res) => {
  try {
    const users = await db.sequelize.query(`
      SELECT 
        u.id,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS full_name_th,
        u.email,
        u.position_name,
        u.position_level,
        u.phone,
        d.department_name_th AS department,
        r.role_name_th AS role
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.is_active = TRUE
      ORDER BY u.id ASC
    `, { type: QueryTypes.SELECT });

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.sequelize.query(`
      SELECT 
        u.id,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS full_name_th,
        u.email,
        u.position_name,
        u.position_level,
        u.phone,
        d.department_name_th AS department,
        r.role_name_th AS role
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = :id
    `, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูล" });
    }

    return res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};