'use strict';
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];

if (!filename) {
  throw Error('Error: No filename specified.');
}

net.createServer(connection => {
  // It reports that the connection has been established
  // (both to the client with connection.write and to the console).
  console.log('Subscriber connected.');
  connection.write(`Now watching ${filename} for changes...\n`);

  // It begins listening for changes to the target file, saving the returned watcher object.
  // This callback sends change information to the client using connection.write.
  const watcher = fs.watch(filename, () => connection.write(`File changed: ${new Date()}\n`));

  // It listens for the connection's close event so it can report that the subscriber
  // has disconnected and stop watching the file, with watcher.close.
  connection.on('close', () => {
    console.log('Subscriber disconnected');
    watcher.close();
  });
}).listen('/tmp/watcher.sock', () => {
  console.log('Listening for subscribers...');
});