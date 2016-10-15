var Promise = require('promise');
var PriceModel = require('./../models/Price');

module.exports = function (id) {
    return new Promise(function (resolve, reject) {
        PriceModel.findById(id, function (err, priceModel) {
            if (err) {
                return reject(err, 500);
            }

            resolve(priceModel, 200);
        });
    });
};