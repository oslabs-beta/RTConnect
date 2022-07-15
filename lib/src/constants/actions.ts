type actionType = {
    CONNECTION: string,
    OFFER: string,
    ANSWER: string,
    LOGIN: string,
    ICECANDIDATE: string,
    CREATE_ROOM: string,
    JOIN_ROOM: string,
}

/**
 * @desc actions that will be used by SignalingChannel and Socket component for being able to filter and identify data passed through websocket message event
*/
const actions: actionType = {
  CONNECTION: 'CONNECTION',
  OFFER: 'OFFER',
  ANSWER: 'ANSWER',
  LOGIN: 'LOGIN',
  ICECANDIDATE: 'ICECANDIDATE',
  CREATE_ROOM: 'CREATE_ROOM',
  JOIN_ROOM: 'JOIN_ROOM'
};

export default actions;
