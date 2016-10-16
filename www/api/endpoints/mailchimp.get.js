const api = require('../api');

module.exports = function (req, res) {
    api.write(res, { error: 'Nothing to do here.' }, 200)
};