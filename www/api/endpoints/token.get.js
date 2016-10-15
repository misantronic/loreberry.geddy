const getToken = require('../../db/methods/getToken');
const api = require('../api');

module.exports = function (req, res) {
    const token = req.params.token;

    if (!token) {
        return api.write(res, { error: 'Missing parameter "id"' }, 500);
    }

    getToken(token)
        .then(data => api.write(res, data, 200))
        .catch(err => api.write(res, err, 500));
};