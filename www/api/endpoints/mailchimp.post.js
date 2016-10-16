const api = require('../api');
const setToken = require('../../db/methods/setToken');
const validateToken = require('../../db/methods/validateToken');
const delToken = require('../../db/methods/delToken');
const getPrice = require('../../db/methods/getPrice');
const setPrice = require('../../db/methods/setPrice');
const updatePrice = require('../../db/methods/updatePrice');

module.exports = function (req, res) {
    const body = req.body || {};
    const type = body.type;

    if (!body.data) {
        return api.write(res, { error: 'Missing payload' }, 500);
    }

    console.log('POST /api/mailchimp', body);

    const token = body.data.merges.TOKEN;
    const email = body.data.email;

    validateToken(token, email)
        .then(tokenFound => {
            if (tokenFound) {
                if (type === 'subscribe') {
                    updatePrice(-0.1, 1, { token: token })
                        .then(() => api.write(res, { success: true }))
                        .catch(err => api.write(res, err, 500));
                }

                if (type === 'unsubscribe') {
                    updatePrice(0.1, -1)
                        .then(() => {
                            setToken(email, token)
                                .then(() => api.write(res, { success: true }))
                                .catch(err => api.write(res, err, 500));
                        })
                        .catch(err => api.write(res, err, 500));
                }
            } else {
                api.write(res, { error: 'Token "' + token + '" not found.' }, 500)
            }
        })
        .catch(err => api.write(res, err, 500));
};