declare type actionType = {
    CONNECTION: string;
    OFFER: string;
    ANSWER: string;
    LOGIN: string;
    ICECANDIDATE: string;
    CREATE_ROOM: string;
    JOIN_ROOM: string;
};
declare const actions: actionType;
export default actions;
