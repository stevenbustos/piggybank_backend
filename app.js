require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

// Database connection
const database = require('./database/connection');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Start server
const port = process.env.API_PORT || 10000;
app.listen(port, () => {
  console.log(`Piggybank server has started on port http://localhost:${port}`)
})

// Routes for the Auth Module
const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

// Routes for the User Model
const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

// Routes for the Piggybank Model
const piggybanksRoute = require('./routes/piggybanks');
app.use('/piggybanks', piggybanksRoute);