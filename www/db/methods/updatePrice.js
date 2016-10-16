const _ = require('underscore');
const getPrice = require('./getPrice');
const setPrice = require('./setPrice');

module.exports = function (addPrice, addShares, addObj = {}) {
    return new Promise(function (resolve, reject) {
        getPrice()
            .then(price => {
                price.current_price = Math.max(price.current_price + addPrice, price.min_price);
                price.shares += addShares;

                _.extend(price, addObj);

                setPrice(price)
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
};