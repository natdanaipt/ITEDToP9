const db = require("../models");
const service = db.service;
const viewServices = db.viewServices;
const { parts } = require("../models");
exports.findAll = (req, res) => {
  service
    .findAll({
      where: { createBy: req.params.uid, status: "1" },
      include: [parts],
      order: [["id", "DESC"]],
      limit: 1,
    })

    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};
exports.View = (req, res) => {
  viewServices
    .findAll({
      where: { createBy: req.params.uid, status: "1" },

      order: [["date", "DESC"]],
    })

    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};
exports.ViewById = (req, res) => {
  const whereClause = {
        createBy: req.params.uid,
        partId: req.params.partId,
        status: "1",
        carId: req.params.carid
      }

  // ✅ ถ้า carid != 0 ค่อยเพิ่มเข้าไปใน where
  if (parseInt(req.params.carid) !== 0) {
    whereClause.carId = req.params.carid;
  }

  viewServices
    .findAll({
      where: whereClause,

      order: [["date", "DESC"]],
    })

    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};

exports.findAllDash = (req, res) => {
   const whereClause = {
        createBy: req.params.uid,
        partId: req.params.partId,
        status: "1",
        carId: req.params.carid
      }

  // ✅ ถ้า carid != 0 ค่อยเพิ่มเข้าไปใน where
  if (parseInt(req.params.carid) !== 0) {
    whereClause.carId = req.params.carid;
  }

  viewServices
    .findOne({
      where:whereClause ,

      order: [["date", "DESC"]],
      limit: 1,
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

exports.create = (req, res) => {
  const newdata = {
    carId:req.body.carid,
    date: req.body.date,
    carId:req.body.carid,
    garage: req.body.garage,
    partId: req.body.partId,
    newDistance: req.body.newDistance,
    partsDetail: req.body.partsDetail,
    price: req.body.price,
    km: req.body.km,
    man: req.body.man,
    status: req.body.status,
    createBy: req.body.createBy,
    createDate: Date.now(),
  };
  service
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

  service
    .update(
      { status: "0", updateDate: Date.now() },
      {
        where: { id: id },
      }
    )
    .then((data) => {
      console.log("service:DELETE  Successfully");
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

  service
    .update(
      {
        date:req.body.date,
        carId:req.body.carid,
        garage: req.body.garage,
        carId:req.body.carid,
        name: req.body.name,
        newDistance: req.body.newDistance,
        partsDetail: req.body.partsDetail,
        km: req.body.km,
        price: req.body.price,
        man: req.body.man,
        updateBy: req.body.updateBy,
        updateDate: Date.now(),
      },
      {
        where: { id: id },
      }
    )
    .then((data) => {
      console.log("UPDATE  Successfully");
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
