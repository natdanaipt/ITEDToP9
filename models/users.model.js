module.exports = (sequelize2, Sequelize) => {
  const users = sequelize2.define("comedu_users", {
    uuid: {
      type: Sequelize.STRING,
    },
    firstname: {
      type: Sequelize.STRING,
    },
    lastname: {
      type: Sequelize.STRING,
    },
    nickname: {
      type: Sequelize.STRING,
    },
    discord_id: {
      type: Sequelize.STRING,
    },
    gen: {
      type: Sequelize.STRING,
    },
    recode: {
      type: Sequelize.STRING,
    },
    timestamp: {
      type: Sequelize.STRING,
    },
    major: {
      type: Sequelize.STRING,
    },
  });

  return users;
};
