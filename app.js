const
	express = require('express'),
	bodyParser = require('body-parser'),
	engine = require('ejs-mate'),
	path = require('path');

const port = 3010;
const app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('', require('./routes/main.js'));
app.use('/sign', require('./routes/sign.js'));
app.use('/verify', require('./routes/verify.js'));

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});
module.exports = app;
