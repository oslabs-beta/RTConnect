<p align="center">
  <img alt="rtconnect", src="assets/RTConnect-logo-transparent.png" width="60%" height="60%"></br>
</p>

<h1 align="center">Implement live streaming and real-time video calls with RTConnect</h1>

RTConnect is open source, React component library that facilitates live, real-time video/audio communications.

RTConnect achieves these features via our downloadeable npm package, our VideoCall and LiveStream React components, and by providing developers with an importable signaling server module that simplifies the implementation of WebRTC, WebSockets, and signaling to establish low latency, real-time communications. While WebRTC takes care of transcoding, packetizing, networking, and security, it does not take care of signaling and implementing its connection logic is no easy walk in the park for even seasoned developers and front-end developers. 

That is where RTConnect comes in - we take care of signaling and implementing WebRTC connection logic for you so all you have to worry about is building compelling live streaming and video conferencing apps. By using RTConnect and letting us worry about all the technicalities of setting up signaling and WebRTC's connection logic, you can focus all your extra time and energy into what really matters - innovation, creation, maybe even disruption in the world of video conferencing and live streaming apps. Who knows? You might even create the next Zoom or Twitch.


## Table of Contents
- [Key Features & Use Cases](#features)
- [RTConnect Demo](#demo)
- [Installation](#install)
- [Getting Started with RTConnect](#implementation)
- [Solutions/Fixes for Polyfill Errors](#errors)
- [Contributing to RTConnect](#contribution)
- [License](#license)
- [The RTConnect Team](#team)
- [Support RTConnect](#support)


## <a name="demo"/> Demo
<p align="center">
  <img align="center" src='https://github.com/oslabs-beta/RTConnect/blob/main/assets/RTConnect-demo.gif'>
</p>


## <a name="install"/> Installing RTConnect

RTConnect is available as an [npm package](https://www.npmjs.com/package/rtconnect).

**npm:**

```
npm install rtconnect
```

## <a name="implementation"/> Getting Started with RTConnect
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


## <a name="errors" /> Polyfill Errors

If you are using Webpack v5.x or used the `npx create-react-app` command and are getting polyfill errors, the following are some potential solutions. 

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

## <a name="contribution" /> Contributing to RTConnect
There are many features and improvements that our team is still adding to RTConect but while we are in the process of implementing some of them, feel free to propose any bug fixes or improvements and how to build and test your changes!

We are currently in the process of: 
- Creating group video calls/video conferences with 2 or more peers by implementing an SFU (Selective Forwarding Unit) video routing service and improving streaming by leveraging WebRTC Simulcast


## <a name="license"/> License
RTConnect is developed under the MIT license.


## <a name="team"/> The Co-Creators of RTConnect
Anthony King  | [GitHub](https://github.com/thecapedcrusader) | [LinkedIn](https://www.linkedin.com/in/aking97)
<br>
F. Raisa Iftekher | [GitHub](https://github.com/fraisai) | [LinkedIn](https://www.linkedin.com/in/fraisa/)
<br>
Yoojin Chang | [GitHub](https://github.com/ychang49265) | [LinkedIn](https://www.linkedin.com/in/yoojin-chang-32a75892/)
<br>
Louis Disen | [GitHub](https://github.com/LouisDisen) | [LinkedIn](https://www.linkedin.com/in/louis-disen/)
<br>

---

## <a name="support"/> ## A big shoutout to all of RTConnect's stargazers! Thank you!
  [![Thanks to all stargazers](https://git-lister.onrender.com/api/stars/oslabs-beta/RTConnect)](https://github.com/oslabs-beta/RTConnect/stargazers)
