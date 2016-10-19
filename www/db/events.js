const pool = {};

module.exports = {
    pool: {},

    trigger: function (event, data) {
        const listener = pool[event];

        if(listener) {
            listener(data);
        }
    },

    listenTo: function (event, fn) {
        pool[event] = fn;
    }
};