var Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
        },
        port: process.env.DB_PORT, //on local
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false,
        freezeTableName: true,
        timezone: '+03:00'
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error(err);
        console.error('Unable to connect to the database');
    });

setInterval(function () {
    sequelize.query('SELECT 1');
}, 5000);

module.exports = sequelize;