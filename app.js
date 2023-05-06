const express = require('express');
const bodyParser = require('body-parser')
const app = express() //Create express app to start node server.
app.use(bodyParser.json())
app.get('/', (req, res, next) => {
    res.send("Hello World!")
})
app.listen(3000);