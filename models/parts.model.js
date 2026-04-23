module.exports = (sequelize, Sequelize) => {
  const parts = sequelize.define("parts", {
    name: {
      type: Sequelize.STRING,
    },
     carId: {
      type: Sequelize.INTEGER,
    },
    distance: {
      type: Sequelize.NUMERIC,
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

  return parts;
};
