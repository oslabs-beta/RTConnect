// consider using enums 
// enums are like objects where the keys are fixed at compile time, so TypeScript can check that the given key actually exists when you access it.
// Unlike some of the types available in TypeScript, enums are preprocessed and are not tested at compile time or runtime so enums save runtime and compile time. 
/*
const enum actions {
    CONNECTION: 'CONNECTION',
    OFFER: 'OFFER',
    ANSWER: 'ANSWER',
    LOGIN: 'LOGIN',
    ICECANDIDATE: 'ICECANDIDATE',
    LEAVE: 'LEAVE',
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM'
}
*/

type actionType = {
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
 * @desc actions that will be used by SignalingChannel and Socket component for being able to filter and identify data passed through websocket message event
*/
const actions: actionType = {
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
