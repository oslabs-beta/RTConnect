const path = require('path');
const express = require('express');
const app = express();


const PORT = 3000;

app.use('/build', express.static(path.join(__dirname, '../build')));
app.use(express.json());


app.listen(PORT, () => {
    console.log('listening on port:', PORT, process.env.NODE_ENV);
});