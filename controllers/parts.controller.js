const db = require("../models");
const parts = db.parts;
const { service } = require("../models");

exports.findAllDash = (req, res) => {
  parts
    .findOne({
      include: [
        {
          order: [["id", "DESC"]],
          limit: 1,
          model: service,
          where: { createBy: req.params.uid, partId: req.params.partId },
        },
      ],
    })

    .then((data) => {
      console.log("dataaaaaa", data);

      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};
exports.findAll = (req, res) => {
  parts
    .findAll({ where: { createBy: req.params.uid,carId:req.params.carid, status: "1" } })

    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};
exports.create = (req, res) => {
  console.log(req.body);
  const newdata = {
    name: req.body.name,
    carId:req.body.carid,
    distance: req.body.distance,
    status: req.body.status,
    createBy: req.body.createBy,
    createDate: Date.now(),
  };
  parts
    .create(newdata)
    .then((data) => {
      res.send(data);
      console.log("Added Success");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the record.",
      });
    });
};
exports.delete = (req, res) => {
  const id = req.params.id;

  parts
    .update(
      { status: "0", updateDate: Date.now() },
      {
        where: { id: id },
      }
    )
    .then((data) => {
      console.log("parts:DELETE  Successfully");
      if (data == 1) {
        res.status(200).send({
          message: `DB_IB${id} was Delete successfully!`,
        });
      } else {
        res.send({
          message: `Cannot delete Test with id=${id}. Maybe Test was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Staff with id=" + id,
      });
    });
};
exports.update = (req, res) => {
  const id = req.params.id;

  parts
    .update(
      {
        distance: req.body.distance,
        carId:req.body.carid,
        name: req.body.name,
        updateBy: req.body.updateBy,
        updateDate: Date.now(),
      },
      {
        where: { id: id },
      }
    )
    .then((data) => {
      console.log("parts:UPDATE  Successfully");
      if (data == 1) {
        res.status(200).send({
          message: `DB_IB${id} was Delete successfully!`,
        });
      } else {
        res.send({
          message: `Cannot delete Test with id=${id}. Maybe Test was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Staff with id=" + id,
      });
    });
};
