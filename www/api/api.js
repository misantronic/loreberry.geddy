require('./../db/mongoose');
require('./../db/redis');

module.exports = {
    init: function (app) {
        // GET
        app.get('/api/polling', require('./endpoints/polling.get'));
        app.get('/api/price/:id', require('./endpoints/price.get'));
        app.get('/api/mailchimp', require('./endpoints/mailchimp.get'));
        app.get('/api/mailchimp/confirm', require('./endpoints/mailchimp.confirm.get'));

        // POST
        app.post('/api/subscribe', require('./endpoints/subscribe.post'));
        app.post('/api/mailchimp', require('./endpoints/mailchimp.post.js'));
    },

    write: function (res, data, status = 200) {
        if (data instanceof Error) {
            data = { error: data.toString() };
        }

        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    }
};