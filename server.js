'use strict'

// Load env data from the .env file
require('dotenv').config();

// App dependencies
// const superagent = require('superagent');
const express = require('express');
const cors = require('cors');

const weatherHandler = require('./components/weather.js')
const movieHandler = require('./components/movie.js')
const errorHandler = require('./components/error.js')

// App Setup
const PORT = process.env.PORT
const app = express();
app.use(cors());

// Route Definitions
app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);
app.get('*', errorHandler)

// renders woohoo on first screen
app.get('/', (request, response) => {
    response.send('WooHoo!')
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
