var Promise = require('promise');
var _ = require('underscore');
var PriceModel = require('./../models/Price');

module.exports = function (id, price = { id: null, start_price: null, final_price: null, current_price: null, shares: null }) {
    return new Promise(function (resolve, reject) {

        var $setPrice = _.reduce(price, function (memo, prop, key) {
            if (prop !== null) {
                memo[key] = prop;
            }

            return memo;
        }, {});

        console.log($setPrice);

        PriceModel.findByIdAndUpdate(
            id,
            { $set: $setPrice },
            function (err) {
                if (err) {
                    return reject(err);
                }

                resolve({ success: true })
            }
        )
    });
};