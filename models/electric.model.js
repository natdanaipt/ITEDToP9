module.exports = (sequelize, Sequelize) => {
  const electric = sequelize.define("electrics", {
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
    createBy: {
      type: Sequelize.INTEGER,
    },
    diff: {
      type: Sequelize.NUMERIC,
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

  return electric;
};
