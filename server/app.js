import express from 'express';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import routeIndex from './routes/index';
import webpackConfig from '../webpack.config';

const debug = process.env.NODE_ENV !== 'production';

// Set up the express app
const app = express();
const publicPath = express.static(path.join(__dirname, '../client/assets'));
const compiler = webpack(webpackConfig);

if (debug) {
  app.use(webpackHotMiddleware(compiler));

  // Log requests to the console.
  app.use(logger('dev'));
}

app.use(webpackDevMiddleware(compiler, {
  // hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json({
  limit: '100mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', publicPath);


// Require our routes into the application.
routeIndex(app);
// Setup a default catch-all route that sends
// back a welcome message in JSON format.
app.get('/*', (req, res) =>
  res.status(200).sendFile(path.join(__dirname, 'index.html'))
);

export default app;
