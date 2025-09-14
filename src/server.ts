import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

/*
async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    app.listen(config.port, () => {
      console.log(`University Backend is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();
*/

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`University Backend is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();

//for Asynchronous Code
process.on('unhandledRejection', () => {
  console.log(`😡 unhandledRejection is detected , shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//for Synchronous Code
process.on('uncaughtException', () => {
  console.log(`😡 uncaughtException is detected , shutting down...`);
  process.exit(1);
});
