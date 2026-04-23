const db = require("../models");
const { QueryTypes } = require("sequelize");

// ========================================
// GET /api/audit-logs — ดึง log ทั้งหมด
// ========================================
exports.findAll = async (req, res) => {
  try {
    const logs = await db.sequelize.query(`
      SELECT
        al.id,
        al.action,
        al.target_table,
        al.target_id,
        al.old_value,
        al.new_value,
        al.ip_address,
        al.description,
        al.action_timestamp,
        CONCAT(u.prefix_th, u.firstname_th, ' ', u.lastname_th) AS actor_name,
        u.email AS actor_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.action_timestamp DESC
    `, { type: QueryTypes.SELECT });

    return res.status(200).json({ success: true, total: logs.length, data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// GET /api/audit-logs/user/:userId — log รายคน
// ========================================
exports.findByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await db.sequelize.query(`
      SELECT
        al.id,
        al.action,
        al.target_table,
        al.target_id,
        al.old_value,
        al.new_value,
        al.description,
        al.action_timestamp
      FROM audit_logs al
      WHERE al.user_id = :userId
      ORDER BY al.action_timestamp DESC
    `, { replacements: { userId }, type: QueryTypes.SELECT });

    return res.status(200).json({ success: true, total: logs.length, data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// helper — เรียกใช้ใน controller อื่น
// เช่น logAction(userId, 'CREATE', 'assets', 1, null, newData, req)
// ========================================
exports.logAction = async (userId, action, targetTable, targetId, oldValue, newValue, req) => {
  try {
    await db.sequelize.query(`
      INSERT INTO audit_logs 
        (user_id, action, target_table, target_id, old_value, new_value, ip_address, description, action_timestamp)
      VALUES 
        (:userId, :action, :targetTable, :targetId, :oldValue, :newValue, :ip, :description, NOW())
    `, {
      replacements: {
        userId,
        action,
        targetTable,
        targetId,
        oldValue:    oldValue  ? JSON.stringify(oldValue)  : null,
        newValue:    newValue  ? JSON.stringify(newValue)  : null,
        ip:          req?.ip || null,
        description: `${action} on ${targetTable} id=${targetId}`,
      },
      type: QueryTypes.INSERT,
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};