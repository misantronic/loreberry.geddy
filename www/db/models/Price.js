const db = require('./../mongoose');

module.exports = db.model('Prices', new db.Schema({
    _id: Number,
    start_price: Number,
    current_price: Number,
    min_price: Number,
    shares: Number
}));