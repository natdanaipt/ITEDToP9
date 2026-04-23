const db = require("../models");
const fuel = db.fuel;
const { Op } = require('sequelize');
const moment = require('moment');
// Retrieve all Tutorials from the database.
async function getPreviousFuel(record) {
  return await fuel.findOne({
    where: {
      carId: record.carId,
      status: "1",
      id: { [Op.lt]: record.id },
    },
    order: [["id", "DESC"]],
  });
}
async function calculateKmPerLitr(record) {
  const previousFuel = await getPreviousFuel(record);

  if (
    previousFuel &&
    previousFuel.km != null &&
    record.km != null &&
    Number(record.km) > Number(previousFuel.km) &&
    Number(record.litr) > 0
  ) {
    const distance = Number(record.km) - Number(previousFuel.km);
    return Number((distance / Number(record.litr)).toFixed(2));
  }

  return null;
}
async function recalculateNextFuels(record) {
  const nextRecords = await fuel.findAll({
    where: {
      carId: record.carId,
      status: "1",
      id: { [Op.gt]: record.id },
    },
    order: [["id", "ASC"]],
  });

  const results = [];

  for (const item of nextRecords) {
    const kmPerLitr = await calculateKmPerLitr(item);

    await fuel.update(
      {
        KmPerLitr: kmPerLitr,
        UpdateDate: Date.now(),
      },
      {
        where: { id: item.id },
      }
    );

    results.push({
      id: item.id,
      KmPerLitr: kmPerLitr,
    });
  }

  return results;
}
exports.findAll = (req, res) => {
  console.log("carid",req.params.carid);
  
  const whereClause = {
    CreateBy: req.params.uid,
    status: "1",
  };

  // ✅ ถ้า carid != 0 ค่อยเพิ่มเข้าไปใน where
  if (parseInt(req.params.carid) !== 0) {
    whereClause.carId = req.params.carid;
  }

  fuel
    .findAll({
      where: whereClause,
      order: [["date", req.params.sort]],
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Data.",
      });
    });
};
exports.getsortdash = (req, res) => {
  const month = moment().format("MM")
  const year = moment().format("YYYY")
  const whereClause = { CreateBy: req.params.uid, carId:req.params.carid, status: "1",date:{
       
  
        [Op.gte]:req.body.rangedate[0],
        [Op.lt]:req.body.rangedate[1]
       
      } };

  // ✅ ถ้า carid != 0 ค่อยเพิ่มเข้าไปใน where
  if (parseInt(req.params.carid) !== 0) {
    whereClause.carId = req.params.carid;
  }
  console.log("mmmmmmmm", month);
  console.log("yyyyyy", year);
  console.log("rangedate", req);

  fuel
    .findAll({
      where: whereClause,
      order: [["date", "ASC"]],
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
    console.log(req.body);
    if (!req.body) {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    const fueldata = {
      date: req.body.date,
      carId: req.body.carid,
      station: req.body.station,
      litr: req.body.litr,
      price: req.body.price,
      km: req.body.km,
      ot_station: req.body.ot_station,
      fueltype: req.body.fueltype,
      status: req.body.status,
      CreateBy: req.body.createBy,
      CreateDate: Date.now(),
      KmPerLitr: null,
    };

    // ✅ ดึงข้อมูลการเติมน้ำมันล่าสุดของรถคันนี้ก่อน (ก่อน insert ใหม่)
    const lastFuel = await fuel.findOne({
      where: { carId: fueldata.carId ,status:"1"},
      order: [["date", "DESC"]],
    });

    // ✅ ถ้ามีข้อมูลก่อนหน้า → คำนวณ Km/L
    if (
      lastFuel &&
      lastFuel.km &&
      fueldata.km > lastFuel.km &&
      fueldata.litr > 0
    ) {
      const distance = fueldata.km - lastFuel.km;
      fueldata.KmPerLitr = distance / fueldata.litr;
    }

    // ✅ บันทึกข้อมูลใหม่
    const newFuel = await fuel.create(fueldata);

    console.log("✅ Added Success, Km/L:", fueldata.KmPerLitr);
    res.status(200).send(newFuel);
  } catch (err) {
    console.error("❌ Error adding fuel:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the record.",
    });
  }
};


exports.delete = (req, res) => {
  const id = req.params.id;

  fuel
    .update(
      { status: "0", UpdateBy: req.params.uid, UpdateDate: Date.now() },
      {
        where: { id: id },
      }
    )
    .then((data) => {
      console.log("DELETE  Successfully");
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
// exports.update = (req, res) => {
//   const id = req.params.id;

//   fuel
//     .update(
//       {
//         date:req.body.date,
//         carId:req.body.carid,
//         station: req.body.station,
//         litr: req.body.litr,
//         price: req.body.price,
//         km: req.body.km,
//         ot_station: req.body.ot_station,
//         fueltype: req.body.fueltype,
//         UpdateBy: req.body.UpdateBy,
//         UpdateDate: Date.now(),
//       },
//       {
//         where: { id: id },
//       }
//     )
//     .then((data) => {
//       console.log("UPDATE  Successfully");
//       if (data == 1) {
//         res.status(200).send({
//           message: `DB_IB${id} was Delete successfully!`,
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Test with id=${id}. Maybe Test was not found!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Could not delete Staff with id=" + id,
//       });
//     });
// };
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const currentFuel = await fuel.findOne({
      where: { id },
    });

    if (!currentFuel) {
      return res.status(404).send({
        message: `Fuel record with id=${id} not found`,
      });
    }

    await fuel.update(
      {
        date: req.body.date,
        carId: req.body.carid,
        station: req.body.station,
        litr: req.body.litr,
        price: req.body.price,
        km: req.body.km,
        ot_station: req.body.ot_station,
        fueltype: req.body.fueltype,
        UpdateBy: req.body.UpdateBy,
        UpdateDate: Date.now(),
      },
      {
        where: { id },
      }
    );

    const updatedRecord = await fuel.findOne({
      where: { id },
    });

    const currentKmPerLitr = await calculateKmPerLitr(updatedRecord);

    await fuel.update(
      {
        KmPerLitr: currentKmPerLitr,
      },
      {
        where: { id },
      }
    );

    const recalculatedNext = await recalculateNextFuels(updatedRecord);

    return res.status(200).send({
      message: `Fuel id=${id} updated successfully`,
      current: {
        id,
        KmPerLitr: currentKmPerLitr,
      },
      recalculatedNext,
    });
  } catch (err) {
    console.error("❌ Error updating fuel:", err);
    return res.status(500).send({
      message: "Could not update fuel with id=" + req.params.id,
    });
  }
};
exports.topOne = (req, res) => {
  fuel
    .findAll({
      where: { CreateBy: req.params.uid, carId:req.params.carid,status: "1" },
      limit: 1,
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
