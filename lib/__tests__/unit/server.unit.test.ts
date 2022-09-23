import SignalingChannel from '../../server/server';
// import { WebSocket } from 'ws';

beforeAll((done) => {
  done();
});

describe('Testing the SignalingChannel class', () => {
  const sc = new SignalingChannel(65530);
  describe('Testing SignalingChannel constructor', () => {
    it('WebSocket server object is initialized', () => {
      expect(typeof sc.webSocketServer).toBe('object');
    });
      
    it('Empty hashmap of users is initialized', () => {
      expect(sc.users.size).toBe(0);
    });
  });

  afterAll((done) => {
    sc.webSocketServer.close();
    done();
  });

});