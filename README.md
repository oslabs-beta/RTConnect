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
- [Setting Up Public Endpoint/URL](#setting)
- [Solutions/Fixes for Polyfill Errors](#errors)
- [Contributing to RTConnect](#contribution)
- [License](#license)
- [The RTConnect Team](#team)
- [Support RTConnect](#support)


## <a name="features"/> Key Features & Use Cases
* Supports video, voice, screen sharing, and generic data to be sent between peers.
* Importable, WebSockets based signaling server module that allows for the rapid exchange of .
* Rapidly set up live video calls in your React codebase without the hassle of implementing WebRTC.


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

**server.js:**
```
// server.js file

const path = require('path');
const express = require('express');
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000;
const app = express();
const { SignalingChannel } = require('rtconnect'); // import the RTConnect Signaling Channel class


app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/build', express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

const server = app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

const SignalChannel = new SignalingChannel(server); // instantiate the RTConnect SignalingChannel

SignalChannel.initializeConnection(); // invoke initializeConnection() method
```

5. Import the RTConnect VideoCall component into your desired .jsx file.

6. Finally use the RTConnect VideoCall component as you would any other React component by passing in `‘ws://localhost:PORT’` as the URL prop as well as the optional mediaOptions prop

- `URL={ ‘ws://localhost:PORT’}` (Note: the PORT whatever you specified when you set up your server so based on the server above, the port is 3000)
- `mediaOptions={{ controls: true, style: { width: ‘640px’, height: ‘480px’ }}`

(Note: If you are using an https server, then pass in `‘wss://localhost:PORT’` as the URL prop).

**App.jsx:**
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

## <a name="setting"/> Setting Up Public Endpoint/URL Using a Secure Tunnel Service
In order to create a publicly accessible URL that will allow you to share access to your localhost server, you have a number of different options but a simple option is to use a secure tunnel service. One such free, secure tunnel service that you can use to create a secure, encrypted, publicly accessible endpoint/URL that other users can access over the Internet is ngrok. 

ngrok Secure Tunnels operate by using a locally installed ngrok agent to establish a private connection to the ngrok service. Your localhost development server is mapped to an ngrok.io sub-domain, which a remote user can then access. Once the connection is established, you get a public endpoint that you or others can use to access your local port. When a user hits the public ngrok endpoint, the ngrok edge figures out where to route the request and forwards the request over an encrypted connection to the locally running ngrok agent.

Thus, you do not need to expose ports, set up forwarding, or make any other network changes. You can simply install [ngrok npm package](https://www.npmjs.com/package/ngrok) and run it.

### Instructions for Using ngrok With RTConnect
1. Sign up for a free ngrok account, verify your email address, and copy your authorization token.

2. Run the following command and replace with add your own authorization token:
```
config authtoken <your authorization token>
```

3. Install the ngrok npm package globally: 
```
npm install ngrok -g
```

4. Start your app - make sure your server is running before you initiate the ngrok tunnel. 

* The following is a a basic example of what your App.jsx and server.js files might look like at this point if you used `npx create-react-app`. If you're using a proxy server, then the default port when you run `npm start` is 3000 so set your server port to something else such as 8080.

**App.jsx:**
```
// App.jsx file

import React from 'react';
import VideoCall from 'rtconnect';

const App = () => {
  return (
    <VideoCall 
      URL={'ws://localhost:8080'}
      mediaOptions={controls}
    />
  )
}
  
export default App;
```

**server.js:**
```
// server.js

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');
const PORT = 8080;
const { SignalingChannel } = require('rtconnect'); // import the RTConnect Signaling Channel class
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

const server = app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

const SignalChannel = new SignalingChannel(server); // instantiate the RTConnect SignalingChannel

SignalChannel.initializeConnection(); // invoke initializeConnection() method
```

5. To start your ngrok Secure Tunnel, run the following command in your terminal:
```
ngrok http 3000 --host-header="localhost:3000"
```

* To make the connection more secure, you can enforce basic authorization on a tunnel endpoint - just use the username and password of your choosing:
```
ngrok http 3000 --host-header="localhost:3000" --auth='<username>:<a password>`
```

6. Copy the https forwarding URL from the terminal and paste it into a new browser tab or send the link to a remote user.


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
Raisa I | [GitHub](https://github.com/fraisai)
<br>
Yoojin Chang | [GitHub](https://github.com/ychang49265) | [LinkedIn](https://www.linkedin.com/in/yoojin-chang-32a75892/)
<br>
Louis Disen | [GitHub](https://github.com/LouisDisen) | [LinkedIn](https://www.linkedin.com/in/louis-disen/)
<br>


## <a name="support"/>A big shoutout to all of RTConnect's stargazers! Thank you!
[![Thank you to all of RTConnect's stargazers](https://git-lister.onrender.com/api/stars/oslabs-beta/RTConnect)](https://github.com/oslabs-beta/RTConnect/stargazers)
