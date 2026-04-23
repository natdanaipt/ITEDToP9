const db = require("../models");
const auth = db.auth;
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
        { expiresIn: "1d" }
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
      { expiresIn: "1d" }
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
    await auth.update(
      { password: hashed },
      { where: { id: user.id } }
    );
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
