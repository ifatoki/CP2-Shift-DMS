import express from 'express';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import routeIndex from './routes/index';

// Set up the express app
const app = express();
const publicPath = express.static(path.join(__dirname, '../client/assets'));

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', publicPath);


// Require our routes into the application.
routeIndex(app);
// Setup a default catch-all route that sends
// back a welcome message in JSON format.
app.get('/', (req, res) =>
  res.status(200).sendFile(path.join(__dirname, 'index.html'))
);

export default app;
