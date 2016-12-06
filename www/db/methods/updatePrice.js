const _ = require('underscore');
const getPrice = require('./getPrice');
const setPrice = require('./setPrice');
const events = require('../events');

module.exports = function (addPrice, addShares, addObj = {}) {
    console.log('updatePrice(' + addPrice + ', ' + addShares + ')');

    return new Promise(function (resolve, reject) {
        getPrice()
            .then(price => {
                price.current_price = Math.max(price.current_price + addPrice, price.min_price);
                price.shares += addShares;

                _.extend(price, addObj);

                setPrice(price)
                    .then(data => {
                        resolve(data);

                        events.trigger('updatePrice', price);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};