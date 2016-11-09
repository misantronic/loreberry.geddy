const Promise = require('promise');
const crypto = require('crypto');
const redis = require('./../redis');

module.exports = function (value, token = null) {
    return new Promise(function (resolve) {
        if(token === null) {
            // Create hash
            const date = (new Date()).valueOf().toString();
            const random = Math.random().toString();

            token = crypto.createHash('sha1').update(date + random).digest('hex');
        }

        redis.set('token.subscribe.'+ token, value, 60 * 60 * 24 * 30);
        redis.set('token.unsubscribe.'+ token, value, 60 * 60 * 24 * 30);

        resolve(token, value);
    });
};