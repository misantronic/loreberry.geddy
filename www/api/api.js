require('./../db/mongoose');
require('./../db/redis');

module.exports = {
    init: function (app) {
        app.get('/api/price/:id', require('./endpoints/price.get'));
        app.get('/api/token/:token', require('./endpoints/token.get'));

        app.post('/api/token', require('./endpoints/token.post'));
        app.post('/api/price/:id/token/:token', require('./endpoints/price.post'));
    },

    write: function (res, data, status = 200) {
        if(data instanceof Error) {
            data = data.toString();
        }

        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    }
};