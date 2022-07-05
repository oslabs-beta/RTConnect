import React, { Component } from 'react';
import { OFFER, ANSWER, ICECANDIDATE} from '../../actions';

/**
 * will be imported
 *  needs to be passed url e.g. 'wss://localhost:8080'
 */
export default Socket = props => {

    //potentially use immediately invoked function expression
    
    const initalizeConnection = () => {
        const { URL } = this.props;
        const ws = new WebSocket(URL);

        ws.onopen = () => {
            console.log('You\'ve connected to the websocket server!')
        }

        //
        // const peerConnection = new RTCPeerConnection();
        // peerConnection.createOffer()
        //data = {action_type, payload}
        ws.onmessage = (data) => {
            data = JSON.parse(data);
            switch (data.ACTION_TYPE) {
                case OFFER:
                    break;
                    //handle offer
                    // sendTo( {type: "OFFER", offer: data.offer, name: connection.name})
                case ANSWER:
                    //handle answer
                    break;
                case ICECANDIDATE:
                    //handle ice candidates
                    // will receive ice candidates from peer1 and now has to 
                    // send to peer 2
                    break;
            }
        }

        ws.onclose = (event) => {

        }

        ws.onerror = (error) => {

        }
    }

    // functional component, does componentDidMount work, or how does the set up work for useEffect for a one time invoke of initialize connection
    return (
        <>
        </>
    )
}