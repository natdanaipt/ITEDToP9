"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("./models");
var auth = require("./controllers/auth.controller");
var fuel = require("./controllers/fuel.controller");
// const db2 = require("./models");
var users = require("./controllers/users.controller");
var parts = require("./controllers/parts.controller");
var service = require("./controllers/service.controller");
var electric = require("./controllers/electric.controller");
var water = require("./controllers/water.controller");
var app = express();
var PORT = 5000;
var pathApi = "/api";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
db.sequelize.sync() //{ force: true } reset database on save
.then(function () {
  console.log("Synced with db_nine");
})["catch"](function (err) {
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
app.get(pathApi + "/", function (req, res) {
  res.json("Hello World form server Nine-App");
});

// customer api
{
  //fuel
  app.get(pathApi + "/fuel/:sort/:uid", fuel.findAll);
  app.post(pathApi + "/addfuel" + "/", fuel.create);
  app["delete"](pathApi + "/deletefuel/:id/:uid", fuel["delete"]);
  app.get(pathApi + "/topfuel/:uid", fuel.topOne);
  app.post(pathApi + "/updatefuel/:id", fuel.update);
  //users
  app.get(pathApi + "/tct_bot", users.findAll);
  app.get(pathApi + "/tct_bot/:id", users.findOne);
  app.post(pathApi + "/login", auth.login);
  //parts
  app.get(pathApi + "/getparts/:uid", parts.findAll);
  app.post(pathApi + "/update/parts/:id", parts.update);
  app.post(pathApi + "/newparts", parts.create);
  app["delete"](pathApi + "/delete/parts/:id", parts["delete"]);

  //services
  app.get(pathApi + "/getservice/:uid", service.findAll);
  app.get(pathApi + "/getserviceview/:uid", service.View);
  app.get(pathApi + "/getserviceviewbyid/:partId/:uid", service.ViewById);
  app.get(pathApi + "/getdashparts/:partId/:uid", service.findAllDash);
  app.post(pathApi + "/newservice", service.create);
  app.post(pathApi + "/update/service/:id", service.update);
  app["delete"](pathApi + "/deleteservice" + "/:id", service["delete"]);
  //electric
  app.get(pathApi + "/get/electric/:uid", electric.findAll);
  app.get(pathApi + "/get/electricdash/:uid", electric.findYearDash);
  app.post(pathApi + "/add/electric", electric.create);
  app["delete"](pathApi + "/delete/electric/:id/:uid", electric["delete"]);
  app.post(pathApi + "/update/electric/:id/:uid", electric.update);
  //water
  app.get(pathApi + "/get/water/:uid", water.findAll);
  app.get(pathApi + "/get/waterdash/:uid", water.findYearDash);
  app.post(pathApi + "/add/water", water.create);
  app["delete"](pathApi + "/delete/water/:id/:uid", water["delete"]);
  app.post(pathApi + "/update/water/:id/:uid", water.update);
}

// Run the server
app.listen(PORT, function () {
  console.log("Nathanon Server Started on port ".concat(PORT));
});
