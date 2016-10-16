const Promise = require('promise');
const crypto = require('crypto');
const redis = require('./../redis');

module.exports = function (token = null) {
    return new Promise(function (resolve) {
        if(token === null) {
            // Create hash
            const date = (new Date()).valueOf().toString();
            const random = Math.random().toString();

            token = crypto.createHash('sha1').update(date + random).digest('hex');
        }

        redis.set('token.'+ token, token, 60 * 60 * 24 * 7);

        resolve(token);
    });
};