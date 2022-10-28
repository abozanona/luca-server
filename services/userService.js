var db = require('../models');
var bCrypt = require('bcryptjs');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var authService = require('./authService');

module.exports.checkPassword = function (hash, password) {
    return bCrypt.compareSync(password, hash);
}

module.exports.login = function (info) {
    return new Promise(function (resolve, reject) {
        if (!info || !info.publicSerialNumber || !info.privateSerialNumber) {
            return reject({ code: 'MISSING_DATA' });
        };
        db.User.findOne({
            where: {
                publicSerialNumber: info.publicSerialNumber,
                privateSerialNumber: info.privateSerialNumber
            }
        }).then((user) => {
            if (!user) {
                return reject({ code: 'ERR_USER_NOT_FOUND' });
            }
            let userObj = user.toJSON();
            delete userObj.privateSerialNumber;
            userObj.token = authService.getTokenUser(userObj.id);
            return resolve(userObj);
        }).catch((err) => {
            console.error(err)
            return reject({ code: 'ERR_LOGIN_FAILED' });
        });
    });
}

module.exports.register = function (info) {
    return new Promise(function (resolve, reject) {
        if (!info || !info.name || !info.publicSerialNumber || !info.privateSerialNumber || !info.avatar) {
            return reject({ code: 'MISSING_DATA' });
        };
        db.User.findOne({
            where: {
                [Op.or]: [
                    {
                        publicSerialNumber: info.publicSerialNumber
                    },
                    {
                        privateSerialNumber: info.privateSerialNumber
                    }
                ]
            }
        }).then((userObj) => {
            if (userObj) {
                return reject({ code: 'USER_ALREADY_EXIST' });
            }
            db.User.create(info).then(function (newUser) {
                if (!newUser) {
                    return reject({ code: 'ERR_SAVE_USER' });
                } else {
                    db.User.findOne({
                        where: {
                            id: newUser.id,
                        }
                    }).then((userObj) => {
                        userObj = userObj.toJSON();
                        delete userObj.privateSerialNumber;
                        userObj.token = authService.getTokenUser(userObj.id);
                        resolve(userObj);
                    })
                }
            }).catch((err) => {
                console.error(err);
                return reject({ code: 'ERR_CAN_NOT_CREATE_USER' });
            });
        }).catch((err) => {
            console.error(err)
            reject({ code: 'ERROR_CHECK_USER_IS_EXIST' });
        });
    });
}

module.exports.getProfileUserLogin = function (info) {
    return new Promise(function (resolve, reject) {
        db.User.findOne({
            where: {
                id: info.userId
            }
        }).then((user) => {
            let userObj = user.toJSON();
            delete userObj.privateSerialNumber;
            return resolve(userObj);
        }).catch((err) => {
            console.error(err)
            return reject({ code: 'ERR_LOGIN_FAILED' });
        });
    });
}

module.exports.getRooms = function (info) {
    return new Promise(function (resolve, reject) {
        db.Room.findAll({
            order: [
                ['createdAt', 'DESC'],
            ],
        }).then((rooms) => {
            return resolve(rooms);
        }).catch((err) => {
            return reject({ code: 'ERR_GET_ROOMS' });
        });
    });
}

module.exports.createRoom = function (info) {
    return new Promise(function (resolve, reject) {
        if (!info || !info.name || !info.pageUrl || !info.ownerId || !info.visibility) {
            return reject({ code: 'MISSING_DATA' });
        };
        db.Room.create({
            name: info.name, pageUrl: info.pageUrl, ownerId: info.ownerId, visibility: info.visibility
        }).then((rooms) => {
            return resolve(rooms);
        }).catch((err) => {
            return reject({ code: 'ERR_GET_ROOMS' });
        });
    });
}

module.exports.follwoUser = function (info) {
    return new Promise(function (resolve, reject) {
        if (!info || !info.currentUserId || !info.otherUserId) {
            return reject({ code: 'MISSING_DATA' });
        };
        db.Friendship.create({
            requesterId: info.currentUserId, addressedId: info.otherUserId
        }).then((friendship) => {
            return resolve(friendship);
        }).catch((err) => {
            return reject({ code: 'ERR_FOLLOW_USER' });
        });
    });
}

module.exports.unfollwoUser = function (info) {
    return new Promise(function (resolve, reject) {
        if (!info || !info.currentUserId || !info.otherUserId) {
            return reject({ code: 'MISSING_DATA' });
        };
        db.Friendship.destroy({
            where: { requesterId: info.currentUserId, addressedId: info.otherUserId },
        }).then((rooms) => {
            return resolve(rooms);
        }).catch((err) => {
            return reject({ code: 'ERR_UNFOLLOW_USER' });
        });
    });
}