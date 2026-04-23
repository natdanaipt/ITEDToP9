const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "e_asset_db", // นี่เป็นชื่อ DB ของเราน
  "postgres", // user ที่ใช้สรการเข้าไปยัง db
  "P@ssw0rd", // password
  {
    host: "localhost", // host ของ db ที่เราสร้างเอาไว้
    dialect: "postgres", // 'mysql' | 'mariadb' | 'postgres' | 'mssql'   พวกนี้ใช่ก็ใช้ได้นะจ๊ะ
    define: {
      timestamps: false, //ส่วนตรงนี้ก็เป็นการตั้งค่าเพิ่มเติม
    },
  }
);

/*const sequelize2 = new Sequelize(
  "tct_bot", // นี่เป็นชื่อ DB ของเราน
  "postgres", // user ที่ใช้สรการเข้าไปยัง db
  "tct31", // password
  {
    host: "localhost", // host ของ db ที่เราสร้างเอาไว้
    dialect: "postgres", // 'mysql' | 'mariadb' | 'postgres' | 'mssql'   พวกนี้ใช่ก็ใช้ได้นะจ๊ะ
    define: {
      timestamps: false, //ส่วนตรงนี้ก็เป็นการตั้งค่าเพิ่มเติม
    },
  }
);*/
const db = {};
// const db2 = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db2.Sequelize = Sequelize;
// db2.sequelize = sequelize2;

db.eassetUsers = require("./easset_user.model")(sequelize, Sequelize);
// db.fuel = require("./fuel.model")(sequelize, Sequelize);
// db.auth = require("./auth.model")(sequelize, Sequelize);
// db.parts = require("./parts.model")(sequelize, Sequelize);
// db.service = require("./service.model")(sequelize, Sequelize);
// db.viewServices = require("./viewServices.model")(sequelize, Sequelize);
// db.electric = require("./electric.model")(sequelize, Sequelize);
// db.water = require("./water.model")(sequelize, Sequelize);
// db.car = require("./car.model")(sequelize, Sequelize);

// db.parts.hasMany(db.service);
// db.service.belongsTo(db.parts);

module.exports = db;
// module.exports = db2;
// ส่วนนี้เป็นการตั้งต่า relation โดยเป็นการบอกว่าใน 1 team มีได้หลาย player ง่ายๆ ก็คือ relation แบบ 1:M
//   db.team.hasMany(
//     db.player,
//     {
//         foreignKey: { name: 'tid', field: 'tid' }, //name ตรงสำคัญพยายามตั่งให้เป็นชื่อเดียวกับ FK ใน table ที่นำไปใช้
//     }
//   };

// ส่วนนี้เป็นการตั้ง relation แบบกลับกันกับด้านบน จริงแล้วเราไม่ตั้งก็ได้แต่แนะนำให้ตั้งเอาไว้ เพราะเวลาที่เราไม่ได้ใส่
// line นี้จะทำให้เราสามารถใช้  team ในการหา player ได้อย่างเดียวและไม่สามารถใช้ player หา team ได้
//   db.player.belongsTo(db.team, { foreignKey: 'tid' });
