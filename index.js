require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const auth = require("./controllers/auth.controller");
const fuel = require("./controllers/fuel.controller");
// const db2 = require("./models");
const users = require("./controllers/users.controller");
const parts = require("./controllers/parts.controller");
const service = require("./controllers/service.controller");
const electric = require("./controllers/electric.controller");
const water = require("./controllers/water.controller");
const eassetUsers = require("./controllers/easset_users.controller");
const assets = require("./controllers/assets.controller");
const auditLog = require("./controllers/audit_log.controller");
const inspection = require("./controllers/inspection.controller");
const aircond = require("./controllers/aircond.controller");
const itassets = require("./controllers/itassets.controller");
const assetItems = require("./controllers/assetitems.controller");
const asset_categories = require("./controllers/asset_categories.controller");

const app = express();
const PORT = 5000;
const pathApi = "/api";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const allowedOrigins = [
  "https://localhost:5173",
  "http://127.0.0.1:5173", // dev (Vite)
  "https://app.ninenap.com", // production
  "http://10.10.9.73",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  }),
);

// ✅ ตอบ OPTIONS request เอง (Safari ชอบ preflight ตรวจ)
app.options("*", cors());

const verifyToken = require("./middleware/verifyToken");
const isAdmin = require("./middleware/isAdmin");
const asset_categoriesModel = require("./models/asset_categories.model");

db.sequelize
  .sync() //{ force: true } reset database on save
  .then(() => {
    console.log("Synced with db_nine");
  })
  .catch((err) => {
    console.log("Failed to sync db_nine: " + err.message);
  });
// db2.sequelize
//   .sync() //{ force: true } reset database on save
//   .then(() => {
//     console.log("Synced with db_tct_bot");
//     console.log("Enjoy !! 👾 🤖");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db_nine: " + err.message);
//   });

// testing api
app.get(pathApi + "/", (req, res) => {
  res.json("Hasdasdasdasasd");
});

// customer api
{
  //auth
   app.post(pathApi + "/auth/kmutnbsso", auth.loginWithSSO);
  //fuel
  app.get(pathApi + "/users/get", users.findAll);
  app.get(pathApi + "/easset/users", eassetUsers.findAll);
  app.get(pathApi + "/easset/users/:id", eassetUsers.findOne);
  app.get(pathApi + "/assets", assets.findAll); // ดึงทั้งหมด
  app.get(pathApi + "/assets/:id", assets.findOne); // ดึงรายชิ้น
  app.post(pathApi + "/assets", assets.create); // เพิ่มใหม่
  app.put(pathApi + "/assets/:id", assets.update); // แก้ไข
  app.delete(pathApi + "/assets/:id", assets.remove); // ลบ

  app.get(pathApi + "/audit-logs", auditLog.findAll);
  app.get(pathApi + "/audit-logs/user/:userId", auditLog.findByUser);

  app.get(pathApi + "/inspections", inspection.findAll);
  app.get(pathApi + "/inspections/year/:year", inspection.findByYear);
  app.get(pathApi + "/inspections/scan/:qr_code", inspection.scanQR);
  app.post(pathApi + "/inspections", inspection.create);

  // เครื่องปรับอากาศ
  app.get(pathApi + "/aircond", aircond.findAll);
  app.get(pathApi + "/aircond/summary", aircond.summary);
  app.get(pathApi + "/aircond/floor/:floor", aircond.findByFloor);

  // ครุภัณฑ์ IT
  app.get(pathApi + "/itassets", itassets.findAll);
  app.get(pathApi + "/itassets/summary", itassets.summary);
  app.get(pathApi + "/itassets/search/:keyword", itassets.search);
  app.get(pathApi + "/itassets/custodian/:name", itassets.findByCustodian);
  app.get(pathApi + "/asset-items", assetItems.findAll);
  app.get(pathApi + "/asset-items/problems", assetItems.findProblems);
  app.get(pathApi + "/asset-items/search/:keyword", assetItems.search);
  app.get(pathApi + "/asset-items/:id", assetItems.findOne);
  app.post(pathApi + "/asset-items", assetItems.create);
  app.put(pathApi + "/asset-items/:id", assetItems.update);
  app.delete(pathApi + "/asset-items/:id", assetItems.remove);
  app.post(pathApi + "/asset-items/test/:an", assetItems.test);

  // asset_categories
  app.get(pathApi + "/asset-cat/get", asset_categories.findAll);
  app.post(pathApi + "/asset-cat", asset_categories.create);
  app.put(pathApi + "/asset-cat/:id", asset_categories.update);
  app.delete(pathApi + "/asset-cat/:id", asset_categories.remove);
}

// Run the server
app.listen(PORT, () => {
  console.log(`Nathanon Server Started on port ${PORT}`);
});
