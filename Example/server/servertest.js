const path = require('path');
const https = require('https');
const express = require('express');
const cors = require('cors');
const SignalingChannel = require('../../lib/server/server.js')
const fs = require('fs');


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/build", express.static(path.join(__dirname, "../../build"))); //for production

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../client/index.html'))
})

// command to create pem files: openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 20 -nodes 
// const options = {
//     key: fs.readFileSync(path.resolve(__dirname, '../../../.ssh/key.pem')), // pem files go in quotes
//     cert: fs.readFileSync(path.resolve(__dirname, '../../../.ssh/cert.pem'))
// };

 //https use, thisisunsafe @ browser
// const server = https.createServer(options, app).listen(PORT, () => {
//     console.log('listening on port:', PORT, process.env.NODE_ENV);
// })

// If you want to use http server
const server = app.listen(PORT, () => {
    console.log('listening on port:', PORT, process.env.NODE_ENV);
});

const WebSocketServer = new SignalingChannel({server: server}); //can pass in a different port
WebSocketServer.initializeConnection();
