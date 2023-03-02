const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/users')
const causeRoutes = require('./routes/causes')
const coinbasetrxRoutes = require('./routes/coinbasetrx')
const axios = require('axios')

const app = express()

//MIDDLEWARE
app.use( bodyParser.json() )
app.use( express.json() )
app.use(morgan("common"))

app.use( cors( {
    origin:'*'
}) )

app.use( '/users', userRoutes )
app.use( '/causes', causeRoutes )
app.use( '/api', coinbasetrxRoutes )

app.get( "/api/coin/:coin", async (req,res) => {

    try {
        const response = await axios.get(`http://api.coinlayer.com/api/live?access_key=a2af0d5a6de53d6bccc4265fe1457d32&symbols=${req.params.coin}`)  
        res.status(200).json(response.data) 
    } catch (error) {
        console.log( {error: error.message} )
        res.status(500).json({ error : error })
    }
} )


mongoose.set("strictQuery", false);
const dburi = process.env.DB_CONNECTION
mongoose.connect(dburi)
console.log('connected to db')

app.listen(process.env.PORT)