type ActionType = {
    CONNECTION: string,
    OFFER: string,
    ANSWER: string,
    LOGIN: string,
    ICECANDIDATE: string,
    LEAVE: string,
    CREATE_ROOM: string,
    JOIN_ROOM: string,
}

/**
 * @constant {object} actions
 * @desc actions used by the SignalingChannel and Socket component to filter and identify the data being passed through the WebSocket message event.
*/
const actions: ActionType = {
  CONNECTION: 'CONNECTION',
  OFFER: 'OFFER',
  ANSWER: 'ANSWER',
  LOGIN: 'LOGIN',
  ICECANDIDATE: 'ICECANDIDATE',
  LEAVE: 'LEAVE',
  CREATE_ROOM: 'CREATE_ROOM',
  JOIN_ROOM: 'JOIN_ROOM'
};

export default actions;