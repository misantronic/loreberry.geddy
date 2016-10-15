const getPrice = require('../../db/methods/getPrice');
const api = require('../api');

module.exports = function (req, res) {
    const id = req.params.id;

    if (!id) {
        return api.write(res, { error: 'Missing parameter "id"' }, 500);
    }

    getPrice(id)
        .then(data => api.write(res, data, 200))
        .catch(err => api.write(res, err, 500));
};