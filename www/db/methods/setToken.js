const Promise = require('promise');
const crypto = require('crypto');
const redis = require('./../redis');

module.exports = function () {
    return new Promise(function (resolve) {
        // Create hash
        const date = (new Date()).valueOf().toString();
        const random = Math.random().toString();
        const hash = crypto.createHash('sha1').update(date + random).digest('hex');

        redis.set('token.'+ hash, hash, 60);

        resolve(hash);
    });
};