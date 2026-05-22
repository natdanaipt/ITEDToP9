const db = require("../models");
const auth = db.auth;
const users = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// ตรวจว่าเป็น hash หรือไม่
function isHashed(password) {
  return password.startsWith("$2b$") || password.startsWith("$2a$");
}
exports.login = async (req, res) => {
  const { username, password, loginType } = req.body;

  // -------------------- GOOGLE LOGIN --------------------
  if (loginType === "google") {
    const userData = await auth.findOne({ where: { email: req.body.email } });

    if (!userData) {
      const created = await auth.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        role: "user",
      });

      const token = jwt.sign(
        {
          id: created.id,
          email: created.email,
          role: created.role,
        },
        JWT_SECRET,
        { expiresIn: "1d" },
      );

      return res.status(200).send({
        uid: created.id,
        fname: created.firstname,
        lname: created.lastname,
        role: created.role,
        token,
      });
    }

    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).send({
      uid: userData.id,
      fname: userData.firstname,
      lname: userData.lastname,
      role: userData.role,
      token,
    });
  }

  // -------------------- LOCAL LOGIN --------------------
  const user = await auth.findOne({ where: { username } });

  if (!user) return res.status(203).send({ message: "unauthorized" });
  if (!isHashed(user.password)) {
    const hashed = await bcrypt.hash(user.password, 10);

    // update DB
    await auth.update({ password: hashed }, { where: { id: user.id } });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(203).send({ message: "unauthorized" });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    // { expiresIn: "1d" }
  );

  return res.status(200).send({
    uid: user.id,
    fname: user.firstname,
    lname: user.lastname,
    role: user.role,
    token,
  });
};

// นี่คือฟังก์ชัน Login แบบ SSO ของเรา
// controllers/authController.js

const loginWithSSO = async (req, res) => {
  const { code } = req.body;
  if (!code)
    return res.status(400).json({ error: "Authorization code is required" });

  try {
    // -------------------------------------------------------------------
    // 1. นำ Code ไปแลกเป็น Access Token (แก้ไขเป็นแบบ Basic Auth)
    // -------------------------------------------------------------------

    // สร้าง Basic Auth Header โดยเอา id:secret มาเข้ารหัส Base64 (คำสั่งของ Node.js)
    const credentials = Buffer.from(
      `${process.env.KMUTNB_CLIENT_ID}:${process.env.KMUTNB_CLIENT_SECRET}`,
    ).toString("base64");

    const tokenResponse = await fetch("https://sso.kmutnb.ac.th/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.KMUTNB_REDIRECT_URI,
        access_type: "offline",
        // สังเกตว่าเราเอา client_id และ client_secret ออกจาก Body แล้ว
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token Exchange Error (401/400):", tokenData);
      return res
        .status(401)
        .json({ error: "Failed to exchange authorization code" });
    }
    console.log("✅ Token Data from KMUTNB++++++++++++:", tokenData);
    // -------------------------------------------------------------------
    // 2. นำ Access Token ไปดึงข้อมูลผู้ใช้ (ใช้ UserInfo Endpoint)
    // -------------------------------------------------------------------
    const profileResponse = await fetch(
      "https://sso.kmutnb.ac.th/resources/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );
    const profileData = await profileResponse.json();

    const profile = await profileData.user_info;
    console.log("✅ Token Data from profileData-----------:", profileData);
    console.log("✅ Token Data from profile:", profile);

    if (!profileResponse.ok) {
      console.error("Fetch Profile Error:", profileData);
      return res.status(401).json({ error: "Failed to fetch user profile" });
    }

    // -------------------------------------------------------------------
    // 3. นำข้อมูลมาจัดการใน Database ด้วย Sequelize
    // -------------------------------------------------------------------
    // 💡 ข้อควรระวัง: ชื่อฟิลด์ (เช่น username, first_name) อาจต้องปรับ
    // ตามที่ มจพ. ส่งกลับมาจริง (แนะนำให้ console.log(profileData) ดูก่อน)
    // ตามมาตรฐาน OIDC มักจะใช้ 'sub' แทน username, 'given_name' แทนชื่อจริง

    // const ssoUsername = profile.sub || "";
    // const ssoFirstName = profile.given_name || "";
    // const ssoLastName = profile.family_name || "";
    // const ssoType = profile.kmutnb_account_type || "student"; // ประเภทผู้ใช้งาน
    // const ssoPersonKey = profile.person_key || ""; // ประเภทผู้ใช้งาน

    const personnelInfo = profileData.kmutnb_personnel_info || {}; // ป้องกันพังถ้าไม่มีข้อมูลส่วนนี้

    const newProfile = {
      sub: profileData.sub || null,
      preferred_username: profileData.preferred_username || "",
      sso_updated_at: profileData.updated_at || null,
      name: profileData.name || "",
      given_name: profileData.given_name || "",
      family_name: profileData.family_name || "",
      locale: profileData.locale || "",
      zoneinfo: profileData.zoneinfo || "",
      email: profileData.email || "",
      email_verified: profileData.email_verified || null,
      kmutnb_account_type: profileData.kmutnb_account_type || "",
      person_key: personnelInfo.person_key || null,
      full_prefix_name_th: personnelInfo.full_prefix_name_th || "",
      firstname_th: personnelInfo.firstname_th || "",
      lastname_th: personnelInfo.lastname_th || "",
      firstname_en: personnelInfo.firstname_en || "",
      lastname_en: personnelInfo.lastname_en || "",
      personnel_type_id: personnelInfo.personnel_type_id || null, // แก้ชื่อตัวแปรตรงนี้แล้ว
      personnel_type_name: personnelInfo.personnel_type_name || "",
      position_id: personnelInfo.position_id || null,
      position_name: personnelInfo.position_name || "",
      position_type_id: personnelInfo.position_type_id || null,
      position_type_th: personnelInfo.position_type_th || "",
      faculty_code: personnelInfo.faculty_code || "",
      faculty_name: personnelInfo.faculty_name || "",
      department_code: personnelInfo.department_code || "",
      department_name: personnelInfo.department_name || "",
      photo: personnelInfo.photo || "",
    };
    const [user, created] = await users.findOrCreate({
      where: { sub: profileData.sub },
      defaults: {
        ...newProfile,
      },
    });

    // หากเคยมีข้อมูลแล้ว ให้อัปเดตข้อมูลล่าสุด
    if (!created) {
      await user.update({
        ...newProfile, // แตกข้อมูลทั้ง 10 กว่าฟิลด์จาก newProfile มาอัปเดต
        lastLogin: new Date(), // อัปเดตเวลาเข้าสู่ระบบล่าสุดควบคู่ไปด้วย
      });
    }

    // -------------------------------------------------------------------
    // 4. สร้าง JWT ของระบบเราเอง แล้วส่งกลับให้ Frontend
    // -------------------------------------------------------------------
    const ourToken = jwt.sign(
      { id: user.id, username: user.sub, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      success: true,
      token: ourToken,
      user: { username: user.sub, role: user.userType },
    });
  } catch (error) {
    console.error("SSO Process Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { loginWithSSO };
