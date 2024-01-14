/* eslint-disable @typescript-eslint/no-unused-vars */
import SignalingChannel from '../../server/server';
import { WebSocket } from 'ws';
import { Server } from 'http';
// import { Event, WebSocketServer } from 'ws';

WebSocket.EventEmitter;
beforeAll((done) => {
  done();
});

describe('Testing the SignalingChannel class', () => {
  const sc = new SignalingChannel(65530);
  const testWebsocketServer = new WebSocket.Server({ port: 5555 });
  describe('Testing SignalingChannel constructor', () => {
    it('WebSocket server object is initialized', () => {
      expect(typeof sc.webSocketServer).toBe('object');
    });

    it('WebSocket server object is initialized', () => {
      expect(typeof sc.webSocketServer).toBe(typeof testWebsocketServer);
    });

    it('Empty hashmap of users is initialized', () => {
      expect(sc.peers.size).toBe(0);
    });
  });

  afterAll((done) => {
    sc.webSocketServer.close();
    testWebsocketServer.close();
    done();
  });
});

// describe('Checking WebSocket response', () => {
//   const sc1 = new SignalingChannel(3032);

//   //   sc1.webSocketServer.onopen;
//   //   // Source: https://stackoverflow.com/questions/55963562/how-to-stop-jest-from-hanging-when-testing-websockets
//   //   it('WebSocket closes connection correctly', () => {
//   //     let disconnected = false;
//   //     sc1.webSocketServer.addListener('close', () => {
//   //       disconnected = true;
//   //       sc1.webSocketServer.close();
//   //     });

//   //     // let error: ErrorEvent;
//   //     // ws.onerror = (e) => {
//   //     //     console.log(error)
//   //     //     error = e;
//   //     // };
//   //     // expect(error.origin).toBe(`ws://localhost:${port}`);
//   //     expect(disconnected).toBe(true);
//   //   });

//   afterAll((done) => {
//     sc1.webSocketServer.close();
//     done();
//   });
// });




