<<<<<<< HEAD
const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const SignalingServer = require("../server/server.js");
=======
const path = require('path');
const https = require('https');
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const SignalingChannel = require('../../server/server.js')
>>>>>>> dev

const app = express();
const PORT = 3001;
// const server = https.createServer(app);

<<<<<<< HEAD
=======
// const WebSocketServer = new SignalingChannel(server); //can pass in a different port

// WebSocketServer.initializeConnection();

>>>>>>> dev
app.use(cors());
app.use(express.json());

app.use("/build", express.static(path.join(__dirname, "../../build"))); //for production

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../client/index.html"));
});

app.listen(PORT, () => {
  const WebSocketServer = new WebSocket.Server({ server: server, path: "/" });
  WebSocketServer.on("connection", function (ws, req) {
    ws.id = Math.floor(Math.random() * 100); //testing for 'unique' id, each socket's id

    // const ip = req.socket.remoteAddress; //grabbing ip addresses for ice candidates --ngrok?
    // console.log(ip);
    // console.log("event start", event, 'event end')

    console.log(
      "Currently serving:",
      WebSocketServer.clients.size,
      "people websockets"
    );
    WebSocketServer.clients.forEach((client) =>
      console.log("client.id", client.id)
    );

    ws.on("message", function (event, message) {
      console.log("message", message, "event", event);
      console.log("ws.roomOffer", ws.roomOffer);

      console.log("event, message:", event, message);
      console.log("parsed buffer event:", event.toString("utf-8"));
      // console.log("WebSocketServer.clients", WebSocketServer.clients)
      WebSocketServer.clients.forEach((client) =>
        client.send(
          JSON.stringify({ id: ws.id, message: event.toString("utf-8") })
        )
      );
      // ws.send(JSON.stringify({id: ws.id, message: event.toString('utf-8')})) //was this
    });

    //client id + message sent back to front
    //ws.data
    //WebSocketServer.clients.forEach(client ...do stuff
    //if (client !== currentClient (ws) && client.readyState === WebSocket.OPEN) client.send(data);
  });

  // WebSocketServer.on('listening', (ws) => {
  //     ws.on('message', (event, message) => {
  //         ws.send(JSON.stringify({id: ws.id, message: event.toString('utf-8')}))
  //     })
  // })

  console.log("listening on port:", PORT, process.env.NODE_ENV);
});
=======
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../client/index.html'))
})

const server = app.listen(PORT, () => {
    console.log('listening on port:', PORT, process.env.NODE_ENV);
});

const WebSocketServer = new SignalingChannel({server: server}); //can pass in a different port
// setTimeout(() => console.log(WebSocketServer.webSocketServer.clients.size, 200))
WebSocketServer.initializeConnection();

// const server = https.createServer(app);
//or pass in a different port
>>>>>>> dev
