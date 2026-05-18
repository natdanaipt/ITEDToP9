module.exports = (sequelize, Sequelize) => {
  const asset_categories = sequelize.define("asset_categories", {
    category_code: {
      type: Sequelize.STRING,
    },
    category_name_th: {
      type: Sequelize.STRING,
    },
    category_name_en: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  });

  return asset_categories;
};
