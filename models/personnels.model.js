module.exports = (sequelize, Sequelize) => {
  const personnels = sequelize.define("personnels", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    
  });

  return personnels;
};
