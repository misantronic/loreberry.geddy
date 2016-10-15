const getPrice = require('../../db/getPrice');

module.exports = function (req, res) {
    function write(data, status = 200) {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    }

    const id = req.query.id;

    if (!id) {
        return write({ error: 'Missing parameter "id"' }, 500);
    }

    getPrice(id)
        .then(write)
        .catch(write);
};