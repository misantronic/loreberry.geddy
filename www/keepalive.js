const http = require('http');

const appUrl = 'http://geddy-v1.herokuapp.com/';

console.log('Running keepalive...');

setInterval(function () {
    console.log('keepalive: Refreshing app "'+ appUrl +'"...');
    http.get(appUrl);
}, 300000);
