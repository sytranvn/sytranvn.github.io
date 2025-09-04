import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import task from './task.js';

const numCPUs = availableParallelism();

const PORT = process.env.PORT || 8000;
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer(async (req, res) => {
    const x = await task();
    res.writeHead(200);
    res.end(`hello world: ${x}\n`);
  }).listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}.`);
  });
}
