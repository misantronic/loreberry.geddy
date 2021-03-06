const Promise = require('promise');
const PriceModel = require('./../models/Price');

module.exports = function (id = process.env.PRICE_ID) {
    return new Promise(function (resolve, reject) {
        PriceModel.findById(id, function (err, priceModel) {
            if (err) {
                return reject(err, 500);
            }

            resolve(priceModel, 200);
        });
    });
};