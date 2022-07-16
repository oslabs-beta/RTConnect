import React from 'react';
import actions from '../constants/actions';
const { LOGIN, ICECANDIDATE, OFFER, ANSWER } = actions;

type SocketType = {
    ws: WebSocket,
    getUsers: (parsedData: []) => void,
    handleReceiveCall: (parsedData: object) => void,
    handleAnswer: (parsedData: object) => void,
    handleNewIceCandidateMsg: (parsedData: object) => void,
}

/**
 * @desc 
 * @param props containing the socket starting the connection with the websocket server and functions to be performed on each switch case event
 * @returns an empty element when rendered but populates the client's socket connection with event listeners to be able to handle the offer-answer model and SDP objects being communicated between both peers.
 */
const Socket = ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg }: SocketType): JSX.Element => {


  // IIFE, this function gets invoked when a new socket instance is created, thus adding all event listeners to the current socket connection and any socket that connects to your application.
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

  // an empty jsx element is rendered because this component is only meant to initalize and load the client's socket connection with event listeners
  return (
    <>
    </>
  );
};

export default Socket;
