module.exports = (sequelize, Sequelize) => {
  const water = sequelize.define("waters", {
    month: {
      type: Sequelize.DATE,
    },
    unit: {
      type: Sequelize.NUMERIC,
    },
    price: {
      type: Sequelize.NUMERIC,
    },
    priceperunit: {
      type: Sequelize.NUMERIC,
    },
    remark: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    diff: {
      type: Sequelize.NUMERIC,
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

  return water;
};
