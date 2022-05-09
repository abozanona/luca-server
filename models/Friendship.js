module.exports = function (sequelize, DataTypes) {
    var Friendship = sequelize.define('friendships', {
        requesterId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
        addressedId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
        friendshipStatus: DataTypes.ENUM('on_hold', 'approved'),
    }, {
        tableName: 'friendships',
        timestamps: true,
        charset: 'utf8mb4',
    });
    return Friendship;
};