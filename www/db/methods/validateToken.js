const Promise = require('promise');
const redis = require('./../redis');

module.exports = function (token, email, type) {
    console.log('validateToken('+ token+', '+ email +', '+ type +')');

    return new Promise(function (resolve, reject) {
        const key = 'token.' + type +'.' + token;

        redis
            .get(key)
            .then(value => resolve(value === email))
            .catch(reject);
    });
};