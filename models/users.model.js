// module.exports = (sequelize, Sequelize) => {
//   const users = sequelize.define("users", {
//     person_key: {
//       type: Sequelize.STRING,
//     },
//     sub: {
//       type: Sequelize.STRING,
//     },
//     email: {
//       type: Sequelize.STRING,
//     },
//     email_verified: {
//       type: Sequelize.BOOLEAN,
//     },
//     preferred_username: {
//       type: Sequelize.STRING,
//     },
//     prefix_th: {
//       type: Sequelize.STRING,
//     },
//     firstname_th: {
//       type: Sequelize.STRING,
//     },
//     lastname_th: {
//       type: Sequelize.STRING,
//     },
//     firstname_en: {
//       type: Sequelize.STRING,
//     },
//     lastname_en: {
//       type: Sequelize.STRING,
//     },
//     position_id: {
//       type: Sequelize.INTEGER,
//     },
//     position_name: {
//       type: Sequelize.STRING,
//     },
//     position_level: {
//       type: Sequelize.STRING,
//     },
//     position_type: {
//       type: Sequelize.STRING,
//     },
//     personnel_type: {
//       type: Sequelize.STRING,
//     },
//     department_id: {
//       type: Sequelize.INTEGER,
//     },
//     role_id: {
//       type: Sequelize.INTEGER,
//     },
//     phone: {
//       type: Sequelize.STRING,
//     },
//     photo_url: {
//       type: Sequelize.STRING,
//     },
//     kmutnb_account_type: {
//       type: Sequelize.STRING,
//     },
//     locale: {
//       type: Sequelize.STRING,
//     },
//     zoneinfo: {
//       type: Sequelize.STRING,
//     },
//     is_active: {
//       type: Sequelize.BOOLEAN,
//     },
//     last_login: {
//       type: Sequelize.STRING,
//     },
//     updated_at: {
//       type: Sequelize.DATE,
//     },
//     created_at: {
//       type: Sequelize.DATE,
//     },
//   });

//   return users;
// };
module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      // ==========================================
      // ส่วนที่ 1: ข้อมูลที่ตรงกับ SSO Payload เป๊ะๆ
      // ==========================================
      person_key: { type: Sequelize.STRING },
      sub: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      email_verified: { type: Sequelize.BOOLEAN },
      preferred_username: { type: Sequelize.STRING },

      // --- เพิ่มใหม่ตาม SSO ---
      name: { type: Sequelize.STRING },
      given_name: { type: Sequelize.STRING },
      family_name: { type: Sequelize.STRING },

      full_prefix_name_th: { type: Sequelize.STRING }, // ปรับจาก prefix_th
      firstname_th: { type: Sequelize.STRING },
      lastname_th: { type: Sequelize.STRING },
      firstname_en: { type: Sequelize.STRING },
      lastname_en: { type: Sequelize.STRING },

      personnel_type_id: { type: Sequelize.INTEGER }, // เพิ่มใหม่
      personnel_type_name: { type: Sequelize.STRING }, // ปรับจาก personnel_type

      position_id: { type: Sequelize.INTEGER },
      position_name: { type: Sequelize.STRING },
      position_type_id: { type: Sequelize.INTEGER }, // เพิ่มใหม่
      position_type_th: { type: Sequelize.STRING }, // ปรับจาก position_type

      faculty_code: { type: Sequelize.STRING }, // เพิ่มใหม่
      faculty_name: { type: Sequelize.STRING }, // เพิ่มใหม่
      department_code: { type: Sequelize.STRING }, // ปรับจาก department_id (SSO ส่งมาเป็น String เช่น '9608')
      department_name: { type: Sequelize.STRING }, // เพิ่มใหม่

      photo: { type: Sequelize.TEXT }, // ปรับจาก photo_url และใช้ TEXT เผื่อรูปเป็น Base64 หรือ URL ยาว

      kmutnb_account_type: { type: Sequelize.STRING },
      locale: { type: Sequelize.STRING },
      zoneinfo: { type: Sequelize.STRING },

      // ==========================================
      // ส่วนที่ 2: ฟิลด์ Custom สำหรับระบบ Dashboard ของเรา
      // ==========================================
      position_level: { type: Sequelize.STRING },
      role_id: { type: Sequelize.INTEGER }, // สำคัญมาก เอาไว้แยกสิทธิ์ Admin/User
      phone: { type: Sequelize.STRING },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },

      last_login: {
        type: Sequelize.DATE, // แนะนำให้แก้จาก STRING เป็น DATE เพื่อให้คิวรี่หาง่ายขึ้น
      },

      // ==========================================
      // ส่วนที่ 3: จัดการเรื่อง Timestamps
      // ==========================================
      // ข้อควรระวัง: SSO มีส่ง profile.updated_at มาเป็นตัวเลข (Unix Timestamp)
      // ดังนั้นเราจะใช้ชื่อ sso_updated_at เพื่อไม่ให้ชนกับระบบ Auto Date ของ Sequelize
      sso_updated_at: { type: Sequelize.INTEGER },
    },
    {
      // ตั้งค่าให้ Sequelize จัดการ created_at และ updated_at ให้อัตโนมัติ
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return users;
};
