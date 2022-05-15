const app = require('../app');
const http = require('http');
const dotenv = require('dotenv').config();

const port = process.env.port || 8900;

app.set('port', port);

const server = http.createServer(app);
server.listen(port);