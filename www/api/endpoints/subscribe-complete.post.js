const api = require('../api');

module.exports = function (req, res) {
    console.log(req.body);

    api.write(res, { success: true });
};