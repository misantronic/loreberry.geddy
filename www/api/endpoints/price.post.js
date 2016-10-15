const setPrice = require('../../db/methods/setPrice');
const getToken = require('../../db/methods/getToken');
const api = require('../api');

module.exports = function (req, res) {
    const body = req.body;
    const id = req.params.id;
    const token = req.params.token;

    if (!id) {
        return api.write(res, { error: 'Missing parameter "id"' }, 500);
    }

    if (!token) {
        return api.write(res, { error: 'Missing parameter "token"' }, 500);
    }

    if (!body) {
        return api.write(res, { error: 'Missing payload' }, 500);
    }

    getToken(token)
        .then(token => {
            if (token) {
                setPrice(id, body)
                    .then(data => api.write(res, data, 200))
                    .catch(err => api.write(res, err, 500));
            } else {
                api.write(res, { error: 'No permission to write!' }, 500)
            }
        })
        .catch(err => api.write(res, err, 500));
};