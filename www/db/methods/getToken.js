var Promise = require('promise');
var redis = require('./../redis');

module.exports = function (token) {
    return new Promise(function (resolve, reject) {
        redis
            .get('token.' + token)
            .then(resolve)
            .catch(reject);
    });
};