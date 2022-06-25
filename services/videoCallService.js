const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');

module.exports.generateRTCToken = (channelName, uid, roleType, tokenType) => {
    return new Promise(function (resolve, reject) {
        if (!channelName) {
            return reject('ERR_CHANNEL_IS_REQUIRED');
        }
        if (!uid || uid === '') {
            return reject('ERR_UID_IS_REQUIRED');
        }
        let role;
        if (roleType == 'publisher') {
            role = RtcRole.PUBLISHER;
        } else if (roleType === 'audience') {
            role = RtcRole.SUBSCRIBER
        } else {
            return reject('ERR_ROLE_IS_INCORRECT');
        }
        const expireTime = 3600*6;


        const currentTime = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTime + expireTime;

        let token;
        if (tokenType === 'userAccount') {
            token = RtcTokenBuilder.buildTokenWithAccount(process.env.AGORA_APP_ID, process.env.AGORA_APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
        } else if (tokenType === 'uid') {
            token = RtcTokenBuilder.buildTokenWithUid(process.env.AGORA_APP_ID, process.env.AGORA_APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
        } else {
            return reject('ERR_TOKEN_TYPE_IS_INVALID');
        }

        return resolve({ 'token': token });
    });
};
