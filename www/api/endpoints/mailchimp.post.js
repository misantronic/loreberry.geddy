const api = require('../api');
const getToken = require('../../db/methods/getToken');
const delToken = require('../../db/methods/delToken');
const getPrice = require('../../db/methods/getPrice');
const setPrice = require('../../db/methods/setPrice');

module.exports = function (req, res) {
    const body = req.body || {};
    const type = body.type;

    if (!body.data) {
        return api.write(res, { error: 'Missing payload' }, 500);
    }

    if (type === 'subscribe') {
        const token = body.data.merges.TOKEN;

        getToken(token)
            .then(dbToken => {
                if (dbToken) {
                    getPrice()
                        .then(price => {
                            price.current_price -= 0.1;
                            price.token = dbToken;
                            price.shares += 1;

                            setPrice(price)
                                .then(() => {
                                    delToken(dbToken);

                                    api.write(res, { success: true });
                                })
                                .catch(err => api.write(res, err, 500));
                        })
                        .catch(err => api.write(res, err, 500));
                }
            })
            .catch(err => api.write(res, err, 500));
    }
};