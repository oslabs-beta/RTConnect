'use strict';
import { WebSocket } from 'ws';

WebSocket.EventEmitter;
beforeAll((done) => {
  done();
});

describe('WebSocket checks', () => {
  describe('WebSocket invalid url checks', () => {
    it('throws an error when using an invalid url', () => {
        
      expect(() => new WebSocket('typo')).toThrow(SyntaxError);
  
      expect(() => new WebSocket('invalid://websocket-echo.com')).toThrow(new Error('The URL\'s protocol must be one of "ws:", "wss:", or "ws+unix:"'));
  
      // URL's pathname is empty
      expect(() => new WebSocket('ws+unix:')).toThrow(SyntaxError);
  
      expect(() => new WebSocket('wss://websocket-echo.com#foo')).toThrow(/The URL contains a fragment identifier/);
    });
  
    afterAll((done) => {
      done();
    });
  });
});