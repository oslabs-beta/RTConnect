'use-strict';
import actions from '../../src/constants/actions';

describe('Check actions object', () => {
  const testActions = {
    CONNECTION: 'CONNECTION',
    OFFER: 'OFFER',
    ANSWER: 'ANSWER',
    LOGIN: 'LOGIN',
    ICECANDIDATE: 'ICECANDIDATE',
    LEAVE: 'LEAVE',
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM'
  };

  test('All the properties are correct', () => {
    expect(actions).toMatchObject(testActions);
  });
  
});