module.exports = (sequelize, Sequelize) => {
  const EassetUser = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    prefix_th:          { type: Sequelize.STRING },
    firstname_th:       { type: Sequelize.STRING },
    lastname_th:        { type: Sequelize.STRING },
    firstname_en:       { type: Sequelize.STRING },
    lastname_en:        { type: Sequelize.STRING },
    email:              { type: Sequelize.STRING },
    position_name:      { type: Sequelize.STRING },
    position_level:     { type: Sequelize.STRING },
    phone:              { type: Sequelize.STRING },
    department_id:      { type: Sequelize.INTEGER },
    role_id:            { type: Sequelize.INTEGER },
    is_active:          { type: Sequelize.BOOLEAN },
  }, {
    tableName: "users",  // ตรงกับตารางใน e_asset_db
    timestamps: false,
  });

  return EassetUser;
};