var Promise = require('promise');
var redis = require('./../redis');

module.exports = function (token, email) {
    return new Promise(function (resolve, reject) {
        const key = 'token.' + token;

        redis
            .get(key)
            .then(value => resolve(value === email))
            .catch(reject);
    });
};