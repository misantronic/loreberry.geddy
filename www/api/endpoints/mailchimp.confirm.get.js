const api = require('../api');

module.exports = function (req, res) {
    console.log(req.params);

    api.write(res, { error: 'Nothing to do here.' }, 200)
};