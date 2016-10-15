var Promise = require('promise');
var PriceModel = require('./Price');

module.exports = function (id) {
    return new Promise(function (resolve, reject) {
        PriceModel.findById(id, function (err, priceModel) {
            if (err) {
                return reject(err, 500);
            }

            console.log(priceModel);

            resolve(priceModel, 200);
        });
    });
};