module.exports = (sequelize, Sequelize) => {
  const Asset = sequelize.define("assets", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_id:        { type: Sequelize.STRING, allowNull: false },
    asset_id_old:    { type: Sequelize.STRING },
    qr_code:         { type: Sequelize.TEXT },
    barcode:         { type: Sequelize.STRING },
    asset_name:      { type: Sequelize.STRING, allowNull: false },
    description:     { type: Sequelize.TEXT },
    unit:            { type: Sequelize.STRING },
    price_per_unit:  { type: Sequelize.DECIMAL },
    quantity:        { type: Sequelize.INTEGER },
    category_id:     { type: Sequelize.INTEGER },
    acquisition_type:{ type: Sequelize.STRING },
    acquisition_date:{ type: Sequelize.DATEONLY },
    useful_life_years:{ type: Sequelize.INTEGER },
    expiry_date:     { type: Sequelize.DATEONLY },
    status:          { type: Sequelize.STRING, defaultValue: "active" },
    location_id:     { type: Sequelize.INTEGER },
    custodian_id:    { type: Sequelize.INTEGER },
    photos:          { type: Sequelize.JSONB, defaultValue: [] },
    department_id:   { type: Sequelize.INTEGER },
    data_updated_at: { type: Sequelize.DATE },
    remark:          { type: Sequelize.TEXT },
    created_by:      { type: Sequelize.INTEGER },
  }, {
    tableName: "assets",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Asset;
};