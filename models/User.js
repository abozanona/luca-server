module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define('users', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING(30),
        publicSerialNumber: DataTypes.STRING(20),
        privateSerialNumber: DataTypes.STRING(20),
        avatar: DataTypes.STRING(20),
    }, {
        tableName: 'users',
        timestamps: true,
        charset: 'utf8mb4',
    });
    return Users;
};