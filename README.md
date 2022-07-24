# RTConnect

RTConnect is an easy-to-use React component library that enables developers to set up live, real-time video calls, between multiple connected peers on different computers in a React app. 

RTConnect achieves these features within the functional scope of React components by simplifying the implementation of WebRTC and Websockets to establish low latency, real-time communications for developers.

<p align="center">
	<img src='https://github.com/oslabs-beta/RTConnect/blob/main/assets/RTConnect-logo-transparent.png' alt="logo" width="300">
	<br>
</p>

[![Stargazers repo roster for @oslabs-beta/RTConnect](https://reporoster.com/stars/notext/oslabs-beta/RTConnect)](https://github.com/oslabs-beta/RTConnect/stargazers)

## Table of Contents
- [What is RTConnect?](#what)
- [Install](#install)
- [Getting Started](#implementation)
- [Demo](#demo)
- [The Team ](#team )


## <a name="what"/> What is RTConnect?

RTConnect is an easy-to-use npm package and React component library that enables developers to establish live, real-time peer to peer video communication in an existing React codebase. 

RTConnect streamlines and simplifies the implementation of WebRTC for developers by providing a React component and signaling server module that operates using Websockets for the backend. 

## <a name="install"/> Install RTConnect
```
npm install rtconnect
```

 ## <a name="implementation"/> Implementation
 After installing the rtconnect npm package, import the VideoComponent component in your React file:
 
 2. Create your server — you have the option of using an http server or setting up a more secure connection by implementing an https server in order to set up a WebSocket secure connection.

(Note: Setting up an https server will require a few extra steps. <a href="https://adamtheautomator.com/https-nodejs/">Instructions on how to set up an https server</a>)

3. Import the RTConnect Signaling Channel class/module and instantiate the RTConnect Signaling Channel. Pass in your http or https server as an argument.

4. Invoke the RTConnect Signaling Channel method, initializeConnection().

```
// server.js file

const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

// import the RTConnect Signaling Channel class
const { SignalingChannel } = require('SignalingChannel');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/build', express.static(path.join(__dirname, '../build')));

app.get('/' (req, res) => {
 res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

const server = app.listen(PORT, () => {
 console.log('Listening on port', PORT);
});

// instantiate the RTConnect SignalingChannel
const SignalChannel = new SignalingChannel(server);

// invoke initializeConnection() method
SignalChannel.initializeConnection;

```

5. Import the RTConnect VideoCall component into your desired .jsx file.

6. Finally use the RTConnect VideoCall component as you would any other React component by passing in ‘ws://localhost:<PORT>’ as the URL prop as well as the optional mediaOptions prop

- URL={ ‘ws://localhost:<PORT>’}
- mediaOptions={{ controls: true, style: { width: ‘640px’, height: ‘480px’ }}

(Note: If you are using an https server, then pass in ‘wss://localhost:<PORT>’ as the URL prop).

```
// App.jsx file

import React from 'react';
import VideoCall from 'rtconnect';

const App = () => {
  return (
    <VideoCall 
      URL={'ws://localhost:3000>'}
      mediaOptions={{ controls: true, style: { width: '640px',    height: '480px'}}}
    />
  )
}

export default App;
```


## <a name="demo"/> Demo
<img src='https://github.com/oslabs-beta/RTConnect/blob/main/assets/RTConnect-demo.gif'>

## <a name="team "/> # The Co-Creators of RTConnect
Anthony King  | [GitHub](https://github.com/thecapedcrusader) | [LinkedIn](https://www.linkedin.com/in/aking97)
<br>
F. Raisa Iftekher    | [GitHub](https://github.com/fraisai) | [LinkedIn](https://www.linkedin.com/in/fraisa/)
<br>
Yoojin Chang   | [GitHub](https://github.com/ychang49265) | [LinkedIn](https://www.linkedin.com/in/yoojin-chang-32a75892/)
<br>
Louis Disen    | [GitHub](https://github.com/LouisDisen) | [LinkedIn](https://www.linkedin.com/in/louis-disen/)
<br>
