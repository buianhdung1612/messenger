const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// ENV
require('dotenv').config()

const port = 3000
const routeClient = require("./routes/client/index.route");

// Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());


// Body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const database = require("./config/database");
database.connect();

// Template engines + static files
app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('public'))

// Tạo biến io cho các file js back-end
global._io = io;

routeClient(app);

server.listen(3000, () => {
  console.log(`listening on ${port}`);
});