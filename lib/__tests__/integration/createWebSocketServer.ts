// import SignalingChannel from '../../server/server';
import { Server } from 'http';
import { WebSocket } from 'ws';
// import { WebSocketServer } from 'ws';

function createWebSocketServer (server: Server): void {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', function (webSocket) {
    webSocket.on('message', function (message) {
      webSocket.send(message);
    });
  });
}

export default createWebSocketServer; 