const { Op } = require("sequelize");
const db = require("../models");
const users = db.eassetUsers;

exports.findAll = (req, res) => {
  personnels
    .findAll(

    )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};