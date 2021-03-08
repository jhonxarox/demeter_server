const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 3000
const api = require('./routes/api')
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api', api)
app.use('/listUsers', api)
app.get('/', (req, res) => {
    res.send("Hello From server")
})

app.listen(port, () => {
    console.log("Server Running from localhost on: ", port) 
})