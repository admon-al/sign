const
	express = require('express'),
	bodyParser = require('body-parser'),
	engine = require('ejs-mate'),
	path = require('path');

const app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('', require('./routes/main'));
app.use('/sign', require('./routes/sign'));
app.use('/verify', require('./routes/verify'));

module.exports = app;
