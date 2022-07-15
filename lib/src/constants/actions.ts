type actionType = {
    CONNECTION: string,
    OFFER: string,
    ANSWER: string,
    LOGIN: string,
    ICECANDIDATE: string,
    CREATE_ROOM: string,
    JOIN_ROOM: string,
}

const actions: actionType = {
    CONNECTION: 'CONNECTION',
    OFFER: 'OFFER',
    ANSWER: 'ANSWER',
    LOGIN: 'LOGIN',
    ICECANDIDATE: 'ICECANDIDATE',
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM'
}

export default actions

// module.exports = actions;
