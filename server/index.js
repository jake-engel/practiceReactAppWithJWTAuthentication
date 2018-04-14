// Main Starting Point of Application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./router');

const app = express();

// DB Setup
mongoose.connect('mongodb://localhost:27017/auth'); // connects mongoose to our db

// App Setup
// Both morgan and body parser are express middleware (any server requests pass through middleware)
app.use(morgan('combined')); // morgan is a logging framework for nodeJS
app.use(bodyParser.json({ type: '*/*' })); // parses incoming requests into json (regardless of request type)
app.use(cors()); // this is where you allow other domains access your server. With no arguments it means anyone can access it
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port, () => {
  console.log('Server listening on port:', port);
});
