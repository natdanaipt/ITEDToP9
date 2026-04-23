module.exports = (sequelize, Sequelize) => {
  const fuel = sequelize.define("fuel", {
    date: {
      type: Sequelize.STRING,
    },
    carId: {
      type: Sequelize.INTEGER,
    },
    station: {
      type: Sequelize.STRING,
    },
    litr: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.STRING,
    },
    km: {
      type: Sequelize.STRING,
    },
    ot_station: {
      type: Sequelize.STRING,
    },
    fueltype: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    CreateBy: {
      type: Sequelize.INTEGER,
    },
    UpdateBy: {
      type: Sequelize.INTEGER,
    },
    CreateDate: {
      type: Sequelize.DATE,
    },
    UpdateDate: {
      type: Sequelize.DATE,
    },
   KmPerLitr: {
  type: Sequelize.FLOAT,
 
},
  });

  return fuel;
};
