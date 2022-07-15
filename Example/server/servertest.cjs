const path = require('path');
const https = require('https');
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const SignalingChannel = require('../../lib/server/server.ts')

const app = express();
const PORT = 3001;
// const server = https.createServer(app);

// const WebSocketServer = new SignalingChannel(server); //can pass in a different port

// WebSocketServer.initializeConnection();

app.use(cors());
app.use(express.json());

app.use("/build", express.static(path.join(__dirname, "../../build"))); //for production

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../client/index.html'))
})

const server = app.listen(PORT, () => {
    console.log('listening on port:', PORT, process.env.NODE_ENV);
});

const WebSocketServer = new SignalingChannel({server: server }); //can pass in a different port
// setTimeout(() => console.log(WebSocketServer.webSocketServer.clients.size, 200))
WebSocketServer.initializeConnection();

// const server = https.createServer(app);
//or pass in a different port
