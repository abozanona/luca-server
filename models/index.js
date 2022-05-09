var sequelize = require('./../config/db.js');
const Sequelize = require('sequelize');

// load models
var models = [
    'User',
    'Room',
    'Friendship',
];

models.forEach(function (model) {
    // module.exports[model] = sequelize.import(__dirname + '/' + model);
    module.exports[model] = require(__dirname + '/' + model)(sequelize, Sequelize.DataTypes)
});

// describe relationships
(function (m) {
    // ------
    m.Room.belongsTo(m.User, { foreignKey: 'ownerId' });
    m.User.hasMany(m.Room, { foreignKey: 'ownerId' });
    // ------
    m.Friendship.belongsTo(m.User, { foreignKey: 'requesterId' });
    m.Friendship.belongsTo(m.User, { foreignKey: 'addressedId' });
    m.User.hasMany(m.Friendship, { foreignKey: 'requesterId' });
    m.User.hasMany(m.Friendship, { foreignKey: 'addressedId' });
    // ------

})(module.exports);
// export connection
module.exports.sequelize = sequelize;