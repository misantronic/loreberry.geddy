var Promise = require('promise');
var Redis = require('ioredis');
var redis = new Redis(process.env.REDIS_URL);

redis
    .on('connect', () => {
        console.log('Redis: Connected to:', process.env.REDIS_URL)
    })
    .on('reconnecting', () => {
        console.log('Redis: Reconnecting...');
    })
    .on('error', err => {
        console.error('Redis: Connection error', err);
    })
    .on('end', () => {
        console.log('Redis: Connection ended');
    });

module.exports = {

    /**
     *
     * @param {string} key
     */
    get: function (key) {
        if (!key) {
            return new Promise(function (resolve, reject) {
                reject({ error: 'Key is missing' });
            });
        }

        console.time('Redis: Cache ' + key);

        return new Promise(function (resolve, reject) {
            redis.get(key, function (err, result) {
                if (err) {
                    return reject(err);
                }

                console.timeEnd('Redis: Cache ' + key);

                resolve(result);
            });
        })
    },

    /**
     *
     * @param {string} key
     * @param {string} value
     * @param {number} expires
     */
    set: function (key, value, expires) {
        redis.set(key, value);

        // Set expire-parameter
        if (expires) {
            redis.expire(key, expires);
        }

        return this;
    }
};