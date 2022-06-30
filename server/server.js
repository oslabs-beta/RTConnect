const ws = require('ws');


const users = {}

/**
 * contains each room created by the client
 * key: room (possible the generated id), values: [users] (each user is the socket, socket.send)
 * {roomID: [...users]}
 */
const rooms = new Map();

onConnection
//do stuff..

onMessage

handleLeaveRoom
//delete room when nobody is longer in.

onClose 
