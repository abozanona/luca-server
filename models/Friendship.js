module.exports = function (sequelize, DataTypes) {
    var Friendship = sequelize.define('friendships', {
        requesterId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
        addressedId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    }, {
        tableName: 'friendships',
        timestamps: true,
        charset: 'utf8mb4',
    });
    return Friendship;
};