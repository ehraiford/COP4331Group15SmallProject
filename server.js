// perform imports
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// initiate app
const app = express()
const db = require('./config/config').get(process.env.NODE_ENV)

// app use
app.use(express.json())
app.use(bodyParser.json())
app.use('/user', require('./routes/users'))
app.use('/account', require('./routes/homepage'))
const { authUser } = require('./authUser')

// make connection
mongoose.connect(db.DATABASE, {useNewUrlParser:true}, () =>{
    console.log('connected')
})

app.get('/', (req, res) => {
    res.send('hello')
    res.status(200)
})

app.post('/user', async(req, res) =>{
    console.log(req.body)
})

app.post('/homepage', authUser, async(req, res) =>{
    console.log("Made it to homepage")
})

// make sure we are connected 
app.listen(9000, () =>{
    console.log('server started')
})