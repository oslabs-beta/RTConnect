# A big shoutout to all of RTConnect's stargazers! Thank you!

[![Thanks to all stargazers](https://git-lister.onrender.com/api/stars/oslabs-beta/RTConnect)](https://github.com/oslabs-beta/RTConnect/stargazers)

<p align="center">
	<img src='https://github.com/oslabs-beta/RTConnect/blob/main/assets/RTConnect-logo-transparent.png' alt="logo" width="300">
	<br>
</p>

RTConnect is an easy-to-use React component library that enables developers to set up live, real-time video calls, between multiple connected peers on different computers in a React app. 

RTConnect achieves these features within the functional scope of React components by simplifying the implementation of WebRTC and Websockets to establish low latency, real-time communications for developers.


## Table of Contents
- [What is RTConnect?](#what)
- [Install](#install)
- [Getting Started and Using RTConnect](#implementation)
- [Demo](#demo)
- [How Can I Contribute](#contribution)
- [The Team](#team)
- [Solutions for Polyfill Errors Whens Using Webpack v5.x or the npx create-react-app Command with RTConnect](#errors)


## <a name="what"/> What is RTConnect?

RTConnect is an easy-to-use npm package and React component library that enables developers to establish live, real-time peer to peer video communication in an existing React codebase. 

RTConnect streamlines and simplifies the implementation of WebRTC for developers by providing a React component and signaling server module that operates using Websockets for the backend. 

## <a name="demo"/> Demo
<img align="center" src='https://github.com/oslabs-beta/RTConnect/blob/main/assets/RTConnect-demo.gif'>


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
const { SignalingChannel } = require('rtconnect');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/build', express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
 res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

const server = app.listen(PORT, () => {
 console.log('Listening on port', PORT);
});

// instantiate the RTConnect SignalingChannel
const SignalChannel = new SignalingChannel(server);

// invoke initializeConnection() method
SignalChannel.initializeConnection();

```

5. Import the RTConnect VideoCall component into your desired .jsx file.

6. Finally use the RTConnect VideoCall component as you would any other React component by passing in ‘ws://localhost:PORT’ as the URL prop as well as the optional mediaOptions prop

- URL={ ‘ws://localhost:PORT’} (Note: the PORT whatever you specified when you set up your server)
- mediaOptions={{ controls: true, style: { width: ‘640px’, height: ‘480px’ }}

(Note: If you are using an https server, then pass in ‘wss://localhost:PORT’ as the URL prop).

```
// App.jsx file

import React from 'react';
import VideoCall from 'rtconnect';

const App = () => {
  return (
    <VideoCall 
      URL={'ws://localhost:3000'}
      mediaOptions={{ controls: true, style: { width: '640px',    height: '480px'}}}
    />
  )
}

export default App;
```
## <a name="contribution" /> How Can I Contribute? 
There are many features and improvements that our team is still adding to RTConect but while we are in the process of implementing some of them, you are more than welcome to help out the RTConnect team!

We are currently in the process of: 
- Creating group video calls/video conferences with 2 or more peers by implementing an SFU (Selective Forwarding Unit) video routing service and improving streaming by leveraging WebRTC Simulcast

## <a name="errors" /> Solutions for Polyfill Errors When Using Webpack v5.x or the npx create-react-app Command

Webpack 4 automatically polyfilled many Node APIs in the browser but Webpack 5 removed this functionality, hence why you might get polyfill errors when using the RTConnect VideoCall component. You can do the following to address polyfill errors related to using Webpack v5.x when using RTConnect.

- [Fixing Polyfill Errors if Using the npx create-react-app Command](#npx). 
- [Fixing Polyfill Errors When Using Webpack v5.x](#webpack). 

### <a name="npx" /> If You Used npx create-react-app to Create Your React App

1. First, install the package using Yarn or npm:
```
npm install react-app-polyfill
```
or

```
yarn add react-app-polyfill
```

2. Then add the following in your src/index.js file.

```
// These must be the first lines in src/index.js
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
// ...
```

### <a name="webpack" /> If you are using Webpack v5.x
1. Add the following to your webpack.config.json 

```
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  resolve: {
    fallback: {
    	buffer: require.resolve('buffer/'),
	utils: require.resolve('utils'),
	tls: require.resolve('tls'),
	gyp: require.resolve('gyp'),
	fs: false,
      }
  },
  
  target: 'web',
  
  plugins: [
     new NodePolyfillPlugin(),
  ]
}
```

2. Then install the following npm packages:

```
npm install -D node-polyfill-webpack-plugin buffer utils tls gyp fs
```

## <a name="team "/> # The Co-Creators of RTConnect
Anthony King  | [GitHub](https://github.com/thecapedcrusader) | [LinkedIn](https://www.linkedin.com/in/aking97)
<br>
F. Raisa Iftekher | [GitHub](https://github.com/fraisai) | [LinkedIn](https://www.linkedin.com/in/fraisa/)
<br>
Yoojin Chang | [GitHub](https://github.com/ychang49265) | [LinkedIn](https://www.linkedin.com/in/yoojin-chang-32a75892/)
<br>
Louis Disen | [GitHub](https://github.com/LouisDisen) | [LinkedIn](https://www.linkedin.com/in/louis-disen/)
<br>
