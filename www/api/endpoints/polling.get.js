const api = require('../api');
const events = require('../../db/events');

module.exports = function (req, res) {
    res.setTimeout(20 * 1000, function () {
        api.write(res, {}, 200);
    });

    events.listenTo('updatePrice', function (price) {
        api.write(res, {
            event: 'updatePrice',
            data: price
        });
    });
};