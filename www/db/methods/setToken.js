const Promise = require('promise');
const crypto = require('crypto');
const redis = require('./../redis');

module.exports = function (value, key = null) {
    return new Promise(function (resolve) {
        if(key === null) {
            // Create hash
            const date = (new Date()).valueOf().toString();
            const random = Math.random().toString();

            key = crypto.createHash('sha1').update(date + random).digest('hex');
        }

        redis.set('token.'+ key, value, 60 * 60 * 24 * 30);

        resolve({ [key]: value });
    });
};