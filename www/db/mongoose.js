const mongoose = require("mongoose");

const mongoURI   = process.env.MONGODB_URI;
const connection = mongoose.connection;

if (!connection.readyState) {
    mongoose.connect(mongoURI, function (err, res) {
        if (err) {
            return console.log('Mongo: ERROR connecting to: ' + mongoURI + '. ' + err);
        }

        console.log('Mongo: Connected to: ' + mongoURI);
    });

    connection.on('error', function (error) {
        console.error('Mongo: Error: ' + error);
        mongoose.disconnect();
    });

    connection.once('open', function() {
        console.log('Mongo: Connection opened...');
    });

    connection.on('reconnected', function() {
        console.log('Mongo: Reconnected...');
    });

    connection.on('disconnected', function() {
        console.log('Mongo: Disconnected.');
    });
}

module.exports = mongoose;