import React from 'react';
import actions from '../constants/actions';
const { LOGIN, ICECANDIDATE, OFFER, ANSWER } = actions;

// tsc to compile
// left off at:
//importing actions.ts properly
//changing example imports to dist file path
//dist is what we will be publishing to npm
//comment all code
//need rtc peer connection
//delete other comments and clean up code

type SocketType = {
    ws: WebSocket,
    getUsers: (parsedData: []) => void,
    handleReceiveCall: (parsedData: object) => void,
    handleAnswer: (parsedData: object) => void,
    handleNewIceCandidateMsg: (parsedData: object) => void,
}

const Socket = ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg }: SocketType): JSX.Element => {


  (function initalizeConnection() {

    ws.addEventListener('open', () => {
      console.log('Websocket connection has opened.');
    });

    ws.addEventListener('close', () => {
      console.log('Websocket connection closed.');
    });

    ws.addEventListener('error', (e) => {
      console.error('Socket Error:', e);
    });

    ws.addEventListener('message', message => {
      const parsedData = JSON.parse(message.data);

      switch (parsedData.ACTION_TYPE) {
        case LOGIN: 
          getUsers(parsedData);
          break;
        case OFFER:
          handleReceiveCall(parsedData);
          break;
        case ANSWER:
          handleAnswer(parsedData);
          break;
        case ICECANDIDATE:
          handleNewIceCandidateMsg(parsedData);
          break;
        default:
          console.error('error', parsedData);
          break;
      }
    });
  })();
  return (
    <>
    </>
  );
};

export default Socket;
