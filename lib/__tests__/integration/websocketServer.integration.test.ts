import SignalingChannel from '../../server/server';
import { WebSocket } from 'ws';

// function createWebSocketServer(server) {
//     const wss = new WebSocket.Server({ server });
//     wss.on("connection", function (webSocket) {
//       webSocket.on("message", function (message) {
//         webSocket.send(message);
//       });
//     });
// }
describe('WebSocket Server', () => {
    beforeAll((done) => {
        // start server
        done();
    });
    
    afterAll(() => {
        // close server
    });
    
    it('server echoes message it received from client', () => {
        // 1. create test client
        // 2. send client message
        // 3. close the client after it receives the response
        // 4. perform assertions on the response
    })
    
})
