import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';

let server: Server;
//  we have to bring the type from http since we use http to make raw node.js server
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

// Since node.js is a event driven architecture, we will listen in the process for uncaughtException and unhandledRejection so that we detect(using process.on) and handle
process.on('unhandledRejection', () => {
  console.log(`UnhandledRejection Detected, shutting Down The Server`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// uncaughtException

process.on('uncaughtException', () => {
  console.log(`uncaughtException Detected, shutting Down The Server`);
  process.exit(1);
});
