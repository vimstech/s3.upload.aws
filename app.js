const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const http        = require('http');
const path        = require('path');
var favicon       = require('serve-favicon');
const app = express();
const awsRoutes = require('./routes/aws');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }));
app.use(bodyParser.json());

app.use('/', awsRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin X-Requested-With, Content-Type, Accept');
  next();
});

app.use((request, response, next) => {
  const error = new Error("Not found.");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) =>  {
  response.status(error.status || 500);
  response.json({
    error: {
      message: error.message
    }
  });
});

const port = 3100;

const  server = http.createServer(app);
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});