// #!/usr/bin/env node
import 'source-map-support/register'; // source-map을 사용하기 위해 추가함.
import App from '../app';
import * as express from "express";

const port: number = Number(process.env.PORT) || 3000;
const app: express.Application = new App().app;

app.listen(port, () => console.log(`Express server listening at ${port}`))
.on('error', err => console.error(err));

// const debug = require('debug')('service:server');
// const http = require('http');
// const PNUApi = require('../app');

// const serverapp = new PNUApi();

// const server = http.createServer(serverapp.app);
// const DEFAULT_PORT = 5000;

// function normalizePort(val : string):number{
//   const port = parseInt(val,10);
//   if(port >= 10){
//     return port;
//   }
//   return DEFAULT_PORT;
// }

// const PORT = normalizePort(process.env.PORT || '3000');

// serverapp.app.set('port', PORT);
// function onError(error: any): void {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   const bind = `Port ${PORT}`;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(`${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(`${bind} is already in use`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }

// // Event listener for HTTP server "listening" event.
// function onListening(): void {
//   const addr = server.address();
//   const bind = typeof addr === 'string'
//     ? `pipe ${addr}`
//     : `port ${addr.port}`;
//   debug(`Listening on ${bind}`);
//   console.log(`"PNU Extension server" Listening on ${bind} SUCCESS ... `);
// }

// server.listen(PORT);
// server.on('error',onError);
// server.on('listening',onListening);