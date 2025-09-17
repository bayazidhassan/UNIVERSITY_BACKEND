import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

/*
async function main() {
  try {
    const port = config.port || 5000;

    await mongoose.connect(config.database_url as string); //use await if your database has auth enabled

    app.listen(port, () => {
      console.log(`University Backend is listening on port ${port}`);
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
    const port = config.port || 5000;

    await mongoose.connect(config.database_url as string); //use await if your database has auth enabled

    server = app.listen(port, () => {
      console.log(`University Backend is listening on port ${port}`);
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
