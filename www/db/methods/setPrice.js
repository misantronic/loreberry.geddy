var Promise = require('promise');
var _ = require('underscore');
var PriceModel = require('./../models/Price');

module.exports = function (price = { id: null, start_price: null, min_price: null, current_price: null, shares: null }) {
    return new Promise(function (resolve, reject) {

        var $setPrice = {};

        if (price.start_price !== null) {
            $setPrice.start_price = price.start_price
        }

        if (price.min_price !== null) {
            $setPrice.min_price = price.min_price
        }

        if (price.current_price !== null) {
            $setPrice.current_price = price.current_price
        }

        if (price.shares !== null) {
            $setPrice.shares = price.shares
        }

        console.log('Mongo: setPrice', $setPrice);

        PriceModel.findByIdAndUpdate(
            price.id,
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