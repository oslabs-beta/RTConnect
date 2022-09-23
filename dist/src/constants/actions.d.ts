declare type ActionType = {
    CONNECTION: string;
    OFFER: string;
    ANSWER: string;
    LOGIN: string;
    ICECANDIDATE: string;
    LEAVE: string;
    CREATE_ROOM: string;
    JOIN_ROOM: string;
};
/**
 * @desc actions used by the SignalingChannel and Socket component to filter and identify the data being passed through the WebSocket message event.
*/
declare const actions: ActionType;
export default actions;
