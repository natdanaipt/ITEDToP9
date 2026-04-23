module.exports = (sequelize, Sequelize) => {
  const car = sequelize.define("cars", {
    Name: {
      type: Sequelize.STRING,
    },
    LicensePlate: {
      type: Sequelize.STRING,
    },
    Province: {
      type: Sequelize.STRING,
    },
    Brand: {
      type: Sequelize.STRING,
    },
    Model: {
      type: Sequelize.STRING,
    },

    VehicleType: {
      type: Sequelize.STRING,
    },
    OwnerId: {
      type: Sequelize.INTEGER,
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
    Status: {
      type: Sequelize.INTEGER,
    },
    IsDefault: {
      type: Sequelize.BOOLEAN,
    },
  });

  return car;
};
