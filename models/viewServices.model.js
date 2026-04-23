module.exports = (sequelize, Sequelize) => {
  const viewServices = sequelize.define("ViewServices", {
    date: {
      type: Sequelize.DATE,
    },
     carId: {
      type: Sequelize.INTEGER,
    },
    distance: {
      type: Sequelize.NUMERIC,
    },
    newDistance: {
      type: Sequelize.NUMERIC,
    },
    garage: {
      type: Sequelize.STRING,
    },
    partId: {
      type: Sequelize.INTEGER,
    },
    partsDetail: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.NUMERIC,
    },
    km: {
      type: Sequelize.NUMERIC,
    },
    man: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    LicensePlate: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    createBy: {
      type: Sequelize.INTEGER,
    },
    updateBy: {
      type: Sequelize.INTEGER,
    },
    createDate: {
      type: Sequelize.DATE,
    },
    updateDate: {
      type: Sequelize.DATE,
    },
  });

  return viewServices;
};
