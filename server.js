const
  http = require('http'),
  app = require('./app'),
  config = require('./config');

const server = http.createServer(app);
server.listen(config.get('port'), (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
});
