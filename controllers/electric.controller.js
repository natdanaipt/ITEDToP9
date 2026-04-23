const { Op } = require("sequelize");
const db = require("../models");
const electric = db.electric;

exports.findAll = (req, res) => {
  electric
    .findAll({
      where: { createBy: req.params.uid, status: "1" },
      order: [["month", "DESC"]],
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
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const newdata = {
    month: req.body.month,
    unit: req.body.unit,
    price: req.body.price,
    priceperunit: req.body.priceperunit,
    remark: req.body.remark,
    status: req.body.status,
    createBy: req.body.createBy,
    createDate: Date.now(),
  };
  electric
    .findOne({ where: { status: "1" }, order: [["month", "DESC"]] })
    .then((data) => {
      const prevmonth = data.dataValues.unit;
      const diff = parseFloat(newdata.unit) - parseFloat(prevmonth);

      electric
        .create({ diff: diff, ...newdata })
        .then((data) => {
          res.send(data);
          console.log("electric:Create Success");
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the record.",
          });
        });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  electric
    .update(
      { status: "0", UpdateBy: req.params.uid, UpdateDate: Date.now() },
      {
        where: { id: id },
      }
    )
    .then((data) => {
      console.log("electric: DELETE  Successfully");
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
    const newUnit = Number(req.body.unit || 0);

    // 1) หา record ปัจจุบัน
    const currentRecord = await electric.findOne({
      where: { id: id },
    });

    if (!currentRecord) {
      return res.status(404).send({
        message: `Record id=${id} not found`,
      });
    }

    // 2) หา record ก่อนหน้าที่ status = 1
    // ปรับ where เพิ่ม uid / userId / meterId / carId ตามโครงสร้างจริงของคุณ
    const previousRecord = await electric.findOne({
  where: {
    status: "1",
    month: {
      [Op.lt]: currentRecord.month, // เอาเฉพาะ id ที่น้อยกว่า
    },
  },
  order: [["id", "DESC"]],
});
    // 3) คำนวณ diff
    let diff = 0;
    if (previousRecord) {
      diff = newUnit - Number(previousRecord.unit || 0);
    }

    // 4) update record ปัจจุบัน
    const [updatedRows] = await electric.update(
      {
        month: req.body.month,
        unit: newUnit,
        diff: diff,
        price: req.body.price,
        priceperunit: req.body.priceperunit,
        remark: req.body.remark,
        status: req.body.status,
        updateBy: req.body.updateBy,
        updateDate: Date.now(),
      },
      {
        where: { id: id },
      }
    );

    if (updatedRows === 1) {
      return res.status(200).send({
        message: `Electric id=${id} updated successfully`,
        diff: diff,
        previousUnit: previousRecord ? previousRecord.unit : null,
      });
    }

    return res.status(400).send({
      message: `Cannot update electric with id=${id}`,
    });
  } catch (err) {
    console.error("electric update error:", err);
    return res.status(500).send({
      message: "Could not update electric with id=" + req.params.id,
    });
  }
};
exports.findYearDash = (req, res) => {
  electric
    .findAll({
      where: { createBy: req.params.uid, status: "1" },
      order: [["month", "DESC"]],
      
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
