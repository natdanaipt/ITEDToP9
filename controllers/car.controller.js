const { Op } = require("sequelize");
const db = require("../models");
const car = db.car;

exports.findAll = (req, res) => {
  car
    .findAll({
      where: { OwnerId: req.params.uid, Status: "1" },
      order: [["id", "DESC"]],
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
exports.create = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    const newdata = {
      Name: req.body.Name,
      LicensePlate: req.body.LicensePlate,
      Province: req.body.Province,
      Brand: req.body.Brand,
      Model: req.body.Model,
      VehicleType: req.body.VehicleType,
      Status: "1",
      OwnerId: req.body.OwnerId,
      CreateBy: req.body.CreateBy,
      CreateDate: Date.now(),
      IsDefault: req.body.IsDefault || false,
    };

    // 🔍 ถ้ารถใหม่เป็น default → ต้องปิด default คันเก่าก่อน
    if (req.body.IsDefault) {
      const existingDefault = await car.findOne({
        where: { OwnerId: req.body.CreateBy, IsDefault: true },
      });

      if (existingDefault) {
        await car.update(
          { IsDefault: false },
          { where: { id: existingDefault.id } }
        );
      }
    }

    // 🚗 เพิ่มรถคันใหม่
    const created = await car.create(newdata);
    console.log("✅ Car: Create Success");
    res.send(created);
  } catch (err) {
    console.error("❌ Error creating car:", err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the car record.",
    });
  }
};


exports.delete = (req, res) => {
  const id = req.params.id;

  car
    .update(
      { Status: "0", UpdateBy: req.params.uid, UpdateDate: Date.now() },
      {
        where: { id: id },
      }
    )
    .then((data) => {
      console.log("car: DELETE  Successfully");
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
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = {
      Name: req.body.Name,
      LicensePlate: req.body.LicensePlate,
      Province: req.body.Province,
      Brand: req.body.Brand,
      Model: req.body.Model,
      VehicleType: req.body.VehicleType,
      OwnerId: req.body.OwnerId,
      UpdateBy: req.body.UpdateBy,
      UpdateDate: Date.now(),
      IsDefault: req.body.IsDefault,
    };

    // ✅ ถ้ามีการตั้งให้เป็น Default
    if (req.body.IsDefault) {
      const existingDefault = await car.findOne({
        where: {
          OwnerId: req.body.UpdateBy,
          IsDefault: true,
          id: { [Op.ne]: id }, // คันอื่นที่ไม่ใช่คันนี้
        },
      });

      if (existingDefault) {
        await car.update(
          { IsDefault: false },
          { where: { id: existingDefault.id } }
        );
      }
    }

    // ✅ ทำการอัปเดตรถ
    const [affectedRows] = await car.update(updatedData, {
      where: { id },
    });

    if (affectedRows === 1) {
      console.log("car: UPDATE successfully");
      res.status(200).send({
        message: `Car ID ${id} was updated successfully!`,
      });
    } else {
      res.status(404).send({
        message: `Car with id=${id} was not found!`,
      });
    }
  } catch (err) {
    console.error("car:update error", err);
    res.status(500).send({
      message: `Could not update car with id=${req.params.id}`,
    });
  }
};

exports.findYearDash = (req, res) => {
  water
    .findAll({
      where: { createBy: req.params.uid, status: "1" },
      order: [["month", "ASC"]],
      limit: 12,
    })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};
