var api = require('../api');
var events = require('../../db/events');

module.exports = function (req, res) {
    events.listenTo('updatePrice', function (price) {
        api.write(res, {
            event: 'updatePrice',
            data: price
        });
    });
};