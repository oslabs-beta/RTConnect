import React, { Component } from 'react';

/**
 * will be imported
 *  needs to be passed url e.g. 'wss://localhost:8080'
 */
export default Socket = props => {
    //list of actions to be checked with switch/cases

    const action = {
        CONNECTION: 'CONNECTION',
        OFFER: 'OFFER',
        ANSWER: 'ANSWER',
        CANDIDATE: 'CANDIDATE',
        CREATE_ROOM: 'CREATE_ROOM',
        JOIN_ROOM: 'JOIN_ROOM'
    }
    const initializeConnection = () => {
        const { URL } = this.props;
        const ws = new WebSocket(URL);

        ws.onopen = () => {

        }
        ws.onmessage = (message) => {

        }

        ws.onclose = (event) => {

        }

        ws.onerror = (error) => {

        }

    const handleRooms = () => {

    }
    
   
}

}