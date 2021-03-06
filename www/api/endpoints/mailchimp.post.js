const api = require('../api');
const validateToken = require('../../db/methods/validateToken');
const delToken = require('../../db/methods/delToken');
const getPrice = require('../../db/methods/getPrice');
const setPrice = require('../../db/methods/setPrice');
const updatePrice = require('../../db/methods/updatePrice');

module.exports = function (req, res) {
    const body = req.body || {};
    const type = body.type; // subscribe | unsubscribe

    console.log('POST /api/mailchimp', body);

    if (!body.data) {
        return api.write(res, { error: 'Missing payload' }, 500);
    }

    const token = body.data.merges.TOKEN;
    const email = body.data.email;
    const priceAdd = process.env.PRICE_ADD || 0.1;

    validateToken(token, email, type)
        .then(tokenFound => {
            if (tokenFound) {
                console.log('--> token found.');

                if (type === 'subscribe') {
                    updatePrice(-priceAdd, 1)
                        .then(() => {
                            delToken(token, type);

                            api.write(res, { success: true });
                        })
                        .catch(err => api.write(res, err, 500));
                }

                if (type === 'unsubscribe') {
                    updatePrice(priceAdd, -1)
                        .then(() => {
                            delToken(token, type);

                            api.write(res, { success: true })
                        })
                        .catch(err => api.write(res, err, 500));
                }
            } else {
                api.write(res, { error: 'Token "' + token + '" not found.' }, 500)
            }
        })
        .catch(err => api.write(res, err, 500));
};