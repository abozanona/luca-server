module.exports = function (sequelize, DataTypes) {
    var Room = sequelize.define('rooms', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING(50),
        pageUrl: DataTypes.STRING(500),
        ownerId: DataTypes.INTEGER.UNSIGNED,
        visibility: DataTypes.ENUM('visible', 'hidden'),
    }, {
        tableName: 'rooms',
        timestamps: true,
        charset: 'utf8mb4',
    });
    return Room;
};