const Promise = require('promise');
const redis = require('./../redis');

module.exports = function (token, prefix) {
    return new Promise(function (resolve) {
        redis.del('token.' + prefix + '.' + token);

        resolve(true);
    });
};