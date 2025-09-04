import http from 'node:http';
import task from './task.js';

const PORT = process.env.PORT || 8000;

// In this case it is an HTTP server
http.createServer(async (req, res) => {
  const x = await task();
  res.writeHead(200);
  res.end(`hello world: ${x}\n`);
}).listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});

