module.exports = (sequelize, Sequelize) => {
  const asset_items = sequelize.define("asset_items", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    department_unit: {
      type: Sequelize.STRING,
    },
    asset_name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    asset_no_main: {
      type: Sequelize.STRING,
    },
    budget_type: {
      type: Sequelize.STRING,
    },
    budget_year: {
      type: Sequelize.STRING,
    },
    asset_code: {
      type: Sequelize.STRING,
    },
    supply_or_assets: {
      type: Sequelize.STRING,
    },
    custodian: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    storage_department: {
      type: Sequelize.STRING,
    },
    asset_no_sub: {
      type: Sequelize.STRING,
    },
    receive_date: {
      type: Sequelize.DATE,
    },
    remark: {
      type: Sequelize.TEXT,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  });

  return asset_items;
};
