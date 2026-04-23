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
const auditLog  = require("./controllers/audit_log.controller");
const inspection = require("./controllers/inspection.controller");


const app = express();
const PORT = 5000;
const pathApi = "/api";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:8080", 
  "http://172.20.10.5:8080",        // dev (Vite)
  "https://app.ninenap.com", // production
  "http://10.10.9.73"
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
  })
);


// ✅ ตอบ OPTIONS request เอง (Safari ชอบ preflight ตรวจ)
app.options("*", cors());

const verifyToken = require("./middleware/verifyToken");
const isAdmin = require("./middleware/isAdmin");

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


app.get(pathApi + "/", (req, res) => {
  res.json("Hasdasdasdasasd");
});

{
  app.get(pathApi + "/users/get", users.findAll);
  app.get(pathApi + "/easset/users",     eassetUsers.findAll);
  app.get(pathApi + "/easset/users/:id", eassetUsers.findOne);
  app.get(pathApi + "/assets",       assets.findAll);   
  app.get(pathApi + "/assets/:id",   assets.findOne);   
  app.post(pathApi + "/assets",      assets.create);    
  app.put(pathApi + "/assets/:id",   assets.update);   
  app.delete(pathApi + "/assets/:id", assets.remove);   

  app.get(pathApi + "/audit-logs",              auditLog.findAll);
  app.get(pathApi + "/audit-logs/user/:userId", auditLog.findByUser);

  app.get(pathApi + "/inspections",              inspection.findAll);
  app.get(pathApi + "/inspections/year/:year",   inspection.findByYear);
  app.get(pathApi + "/inspections/scan/:qr_co de",inspection.scanQR);
  app.post(pathApi + "/inspections",             inspection.create);
  // app.post(pathApi + "/get/fuel/sortdash/:uid/:carid",verifyToken ,fuel.getsortdash);
  // app.post(pathApi + "/addfuel" + "/", verifyToken,fuel.create);
  // app.delete(pathApi + "/deletefuel/:id/:uid",verifyToken, fuel.delete);
  // app.get(pathApi + "/topfuel/:uid/:carid", fuel.topOne);
  // app.post(pathApi + "/updatefuel/:id",verifyToken, fuel.update);
  // //users
  // app.get(pathApi + "/tct_bot", verifyToken,isAdmin,users.findAll);
  // app.get(pathApi + "/tct_bot/:id", verifyToken,isAdmin,users.findOne);
  // app.post(pathApi + "/login", auth.login);
  // //parts
  // app.get(pathApi + "/getparts/:uid/:carid",verifyToken, parts.findAll);
  // app.post(pathApi + "/update/parts/:id",verifyToken, parts.update);
  // app.post(pathApi + "/newparts", verifyToken,parts.create);
  // app.delete(pathApi + "/delete/parts/:id",verifyToken, parts.delete);

  // //services
  // app.get(pathApi + "/getservice/:uid", verifyToken,service.findAll);
  // app.get(pathApi + "/getserviceview/:uid",verifyToken, service.View);
  // app.get(pathApi + "/getserviceviewbyid/:partId/:uid/:carid",verifyToken, service.ViewById);
  // app.get(pathApi + "/getdashparts/:partId/:uid/:carid",verifyToken, service.findAllDash);
  // app.post(pathApi + "/newservice",verifyToken, service.create);
  // app.post(pathApi + "/update/service/:id", verifyToken,service.update);
  // app.delete(pathApi + "/deleteservice" + "/:id", verifyToken,service.delete);
  // //electric
  // app.get(pathApi + "/get/electric/:uid", verifyToken,electric.findAll);
  // app.get(pathApi + "/get/electricdash/:uid",verifyToken,electric.findYearDash);
  // app.post(pathApi + "/add/electric",verifyToken, electric.create);
  // app.delete(pathApi + "/delete/electric/:id/:uid",verifyToken, electric.delete);
  // app.post(pathApi + "/update/electric/:id/:uid",verifyToken, electric.update);
  // //water
  // app.get(pathApi + "/get/water/:uid",verifyToken, water.findAll);
  // app.get(pathApi + "/get/waterdash/:uid", verifyToken,water.findYearDash);
  // app.post(pathApi + "/add/water", verifyToken,water.create);
  // app.delete(pathApi + "/delete/water/:id/:uid",verifyToken, water.delete);
  // app.post(pathApi + "/update/water/:id/:uid", verifyToken,water.update);
  // //car
  // app.get(pathApi + "/get/car/:uid",verifyToken, car.findAll);
  // app.post(pathApi + "/add/car", verifyToken,car.create);
  // app.post(pathApi + "/update/car/:id",verifyToken, car.update);
  // app.delete(pathApi + "/delete/car/:id/:uid",verifyToken, car.delete);
}

// Run the server
app.listen(PORT, () => {
  console.log(`Nathanon Server Started on port ${PORT}`);
});
