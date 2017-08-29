#!/usr/bin/env node

import debug from 'debug';
import http from 'http';
import app from '../app';
import models from '../models';

debug('init:server');

/**
 * Normalize the passed port and verify its validity
 * @function normalizePort
 *
 * @param {string} val - Port
 * @returns {number|false} a valid port or a false.
 */
const normalizePort = (val) => {
  const myPort = parseInt(val, 10);
  if (isNaN(myPort)) {
    return val;
  }

  if (myPort >= 0) {
    return myPort;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

/**
 * Handle and throw errors
 * @function onError
 *
 * @param {Error} error - Error thrown
 * @throws {Error} when an error occurs
 * @return {void}
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    process.exit(1);
    break;
  case 'EADDRINUSE':
    process.exit(1);
    break;
  default:
    throw error;
  }
};
/**
 * Handle successful listening
 * @function onListening
 * @returns {void}
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`🚧 Application is Listening on ${bind}`);
};

/**
 * Synchronize the sequelize models with the database object
 * */
models.sequelize.sync().then(() => {
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});

