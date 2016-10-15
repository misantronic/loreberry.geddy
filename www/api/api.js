require('./../db/mongoose');

module.exports = {
    init: function (app) {
        app.get('/api/price', require('./endpoints/price'));
    }
};