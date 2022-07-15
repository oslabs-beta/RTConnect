declare type actionType = {
    CONNECTION: string;
    OFFER: string;
    ANSWER: string;
    LOGIN: string;
    ICECANDIDATE: string;
    CREATE_ROOM: string;
    JOIN_ROOM: string;
};
/**
 * @desc actions that will be used by SignalingChannel and Socket component for being able to filter and identify data passed through websocket message event
*/
declare const actions: actionType;
export default actions;
