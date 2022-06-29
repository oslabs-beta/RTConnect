const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const PORT = 3001;

// const server2 = require('http').createServer(app);

app.use(cors());
app.use(express.json());

app.use('/build', express.static(path.join(__dirname, '../../build'))); //for production

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../client/index.html'))
})

// const WebSocketServer = new WebSocket.Server({server: server, path: "/"})

// WebSocketServer.on("connection", function(event){
//    console.log('someone has connected')
// });

// WebSocketServer.on("message", function(event, message){
//     console.send(message);
//  });

const server = app.listen(PORT, () => {
    const WebSocketServer = new WebSocket.Server({server: server, path: "/"})
    WebSocketServer.on("connection", function(event) {
        event.id = Math.floor(Math.random() * 100); //testing for 'unique' id

        // console.log("event start", event, 'event end')
        console.log('Server: someone has connected')
        console.log('Currently serving:', WebSocketServer.clients.size, 'people websockets')
        WebSocketServer.clients.forEach(client => console.log('client.id', client.id));

        //User.find({}).then(data => )
    });
     
     // WebSocketServer.on("message", function(event, message){
     //     console.send(message);
     //  });
    console.log('listening on port:', PORT, process.env.NODE_ENV);
});