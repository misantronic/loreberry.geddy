var pool = {};

module.exports = {
    pool: {},

    trigger: function (event, data) {
        var listener = pool[event];

        if(listener) {
            listener(data);
        }
    },

    listenTo: function (event, fn) {
        pool[event] = fn;
    }
};