#!/usr/bin/env node

/**
 * Module dependencies.
 */
import 'reflect-metadata';
import app from '../app.js';
import debugLibrary from 'debug'
import http from 'http';
import {configVariables} from "../common/config/configVariables.js";
import {pgClient} from "../common/database/pgClient.js";

const debug = debugLibrary('employeeapi:server')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(configVariables.SERVER_PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, async () => {
  try {
    await testConnection()
    console.log(`server started on port: ${port}`)
  } catch (e) {
    await pgClient.end()
    console.error(e)
  }
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

async function onError(error) {
  await pgClient.end()
  console.log('pool has ended')
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}

async function testConnection() {
  try {
    const client = await pgClient.connect(); // try to connect
    console.log("conected to database")
    client.release(); // success, release connection;
  } catch (e) {
    console.error("There was an issue connecting to the database")
    throw e
  }

}