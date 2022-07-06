import React, { Component } from 'react';
import {OFFER, ANSWER, ICECANDIDATE} from '../../../actions';

// const {OFFER, ANSWER, ICECANDIDATE} = actions

/**
 * will be imported
 *  needs to be passed url e.g. 'wss://localhost:8080'
 * 
 */
const Socket = (props) => {

    //potentially use immediately invoked function expression
    
    const initalizeConnection = () => {
        const { URL } = this.props;
        const ws = new WebSocket(URL);

        ws.onopen = () => {
            console.log('You\'ve connected to the websocket server!')
        }
        // const peerConnection = new RTCPeerConnection();
        // peerConnection.createOffer()

        const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        const peerConnection = new RTCPeerConnection(configuration); //config -- ice: stun server

        //data = {action_type, payload}
        ws.onmessage = async (data) => {
            data = JSON.parse(data);
            switch (data.ACTION_TYPE) {
                case OFFER:
                    // data = {
                    //     action_type: OFFER,
                    //     payload: 'adskfjasdlkfjasdflkjasdfk asdfjsa'
                    // }
                    // const { payload } = data
                    const offerPayload = data.payload;
                    const offerDesc = new RTCSessionDescription(offerPayload);
                    peerConnection.setRemoteDescription(offerDesc)
                    const answer = await peerConnection.createAnswer()
                    await peerConnection.setLocalDescription(answer)
                    ws.send({'answer': answer})
                    break;
                    //handle offer
                case ANSWER:
                    // ({ payload } = data)
                    const answerPayload = data.payload;
                    const answerDesc = new RTCSessionDescription(answerPayload);
                    await peerConnection.setRemoteDescription(answerDesc);
                    break;
                case ICECANDIDATE:
                    //handle ice candidates
                    // ({payload} = data)
                    const answerIceCandidate = data.payload;
                    peerConnection.addIceCandidate(answerIceCandidate)
                    break;
            }
        }

        ws.onclose = (event) => {

        }

        ws.onerror = (error) => {
            console.log(`Socket Error: ${error}`)
            return `Socket Error: ${error}`

        }
    }

    // functional component, does componentDidMount work, or how does the set up work for useEffect for a one time invoke of initialize connection
    return (
        <>
        </>
    )
}

export default Socket;