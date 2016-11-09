const express = require('express');
const timeout = require('connect-timeout');
const compression = require('compression');
const bodyParser = require('body-parser');
const api = require('./api/api');
const allowCors = require('./allowCors');

const publicPath = __dirname + '/../public';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(allowCors);

app.use(timeout('90s'));
app.use(compression());
app.use(express.static(publicPath));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    if (!req.timedout) next();
});

// views is directory for all template files
app.set('views', publicPath);
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('index');
});

api.init(app);

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
