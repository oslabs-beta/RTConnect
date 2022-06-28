const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const PORT = 3001;

const server2 = require('http').createServer(app);

app.use(cors());
app.use(express.json());

// app.use('/build', express.static(path.join(__dirname, '../build'))); //for production

console.log("WebSocket:", WebSocket);
const WebSocketServer = new WebSocket.Server({server: server2, path: "/"})

// WebSocketServer.on("connection", function(event){}
//    console.log('someone has connected')
// });

// WebSocketServer.on("message", function(event, message){
//     console.send(message);
//  });

app.listen(PORT, () => {
    console.log('listening on port:', PORT, process.env.NODE_ENV);
});