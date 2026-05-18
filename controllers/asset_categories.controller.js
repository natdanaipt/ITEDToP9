const db = require("../models");
const { QueryTypes } = require("sequelize");

// GET /api/asset-cat/get
exports.findAll = async (req, res) => {
  try {
    const data = await db.sequelize.query(
      `SELECT id, category_code, category_name_en, category_name_th, description
       FROM asset_categories ORDER BY id ASC`,
      { type: QueryTypes.SELECT },
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/asset-cat
exports.create = async (req, res) => {
  try {
    const { category_code, category_name_en, category_name_th, description } =
      req.body;
    if (!category_code || !category_name_th) {
      return res.status(400).json({ message: "กรุณากรอกรหัสและชื่อหมวดหมู่" });
    }
    if (category_code.length > 4) {
      return res
        .status(400)
        .json({ message: "รหัสหมวดหมู่ต้องไม่เกิน 4 ตัวอักษร" });
    }
    await db.sequelize.query(
      `INSERT INTO asset_categories (category_code, category_name_en, category_name_th, description, created_at, updated_at)
       VALUES (:category_code, :category_name_en, :category_name_th, :description, NOW(), NOW())`,
      {
        replacements: {
          category_code,
          category_name_en: category_name_en || "",
          category_name_th,
          description: description || "",
        },
        type: QueryTypes.INSERT,
      },
    );
    res.status(201).json({ success: true, message: "เพิ่มหมวดหมู่สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/asset-cat/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_code, category_name_en, category_name_th, description } =
      req.body;
    if (category_code && category_code.length > 4) {
      return res
        .status(400)
        .json({ message: "รหัสหมวดหมู่ต้องไม่เกิน 4 ตัวอักษร" });
    }
    await db.sequelize.query(
      `UPDATE asset_categories SET
        category_code = :category_code,
        category_name_en = :category_name_en,
        category_name_th = :category_name_th,
        description = :description,
        updated_at = NOW()
       WHERE id = :id`,
      {
        replacements: {
          id,
          category_code,
          category_name_en: category_name_en || "",
          category_name_th,
          description: description || "",
        },
        type: QueryTypes.UPDATE,
      },
    );
    res.status(200).json({ success: true, message: "แก้ไขหมวดหมู่สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/asset-cat/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await db.sequelize.query(`DELETE FROM asset_categories WHERE id = :id`, {
      replacements: { id },
      type: QueryTypes.DELETE,
    });
    res.status(200).json({ success: true, message: "ลบหมวดหมู่สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
