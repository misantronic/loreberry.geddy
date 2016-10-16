const _ = require('underscore');

module.exports = function (addPrice, addShares, addObj = {}) {
    return new Promise(function (resolve, reject) {
        getPrice()
            .then(price => {
                price.current_price += addPrice;
                price.shares += addShares;

                _.extend(price, addObj);

                setPrice(price)
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
};