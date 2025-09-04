import http from 'node:http';

const PORT = process.env.PORT || 8000;

// In this case it is an HTTP server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});

