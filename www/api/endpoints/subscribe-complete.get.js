const api = require('../api');

module.exports = function (req, res) {
    api.write(res, { success: true });
};