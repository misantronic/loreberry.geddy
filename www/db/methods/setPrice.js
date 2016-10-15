var Promise = require('promise');
var _ = require('underscore');
var PriceModel = require('./../models/Price');

module.exports = function (id, price = { id: null, start_price: null, final_price: null, current_price: null, shares: null }) {
    return new Promise(function (resolve, reject) {

        var $setPrice = {};

        if (price.start_price !== null) {
            $setPrice.start_price = price.start_price
        }

        if (price.final_price !== null) {
            $setPrice.final_price = price.final_price
        }

        if (price.current_price !== null) {
            $setPrice.current_price = price.current_price
        }

        if (price.shares !== null) {
            $setPrice.shares = price.shares
        }

        console.log('Mongo: setPrice', $setPrice);

        PriceModel.findByIdAndUpdate(
            id,
            { $set: $setPrice },
            function (err) {
                if (err) {
                    return reject(err);
                }

                resolve($setPrice)
            }
        )
    });
};