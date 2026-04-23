module.exports = (sequelize, Sequelize) => {
  const services = sequelize.define("services", {
    date: {
      type: Sequelize.DATE,
    },
     carId: {
      type: Sequelize.INTEGER,
    },
    garage: {
      type: Sequelize.STRING,
    },
    partId: {
      type: Sequelize.INTEGER,
    },
    newDistance: {
      type: Sequelize.NUMERIC,
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

  return services;
};
