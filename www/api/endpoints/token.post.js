const setToken = require('../../db/methods/setToken');
const api = require('../api');

module.exports = function (req, res) {
    setToken()
        .then(data => api.write(res, data, 200))
        .catch(err => api.write(res, err, 500));
};