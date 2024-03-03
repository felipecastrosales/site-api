const http = require('http');
const { handleRequest } = require('./handle-request');

const server = http.createServer(handleRequest);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
