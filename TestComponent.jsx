import React from 'react';
import Rtconnect from './Example/client/Rtconnect.jsx';
import { SocketContextProvider } from './SocketContext.jsx';

const TestComponent = ({devURL}) => {
    return (
    <SocketContextProvider>
        <Rtconnect URL={devURL} />
    </SocketContextProvider>
    )
}

export default TestComponent;