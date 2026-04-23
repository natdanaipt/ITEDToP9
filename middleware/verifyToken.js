const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

module.exports = function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).send({ message: "no token" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).send({ message: "invalid token format" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ message: "invalid token" });

    req.user = decoded; // เช่น { id, email, role }
    next();
  });
};
