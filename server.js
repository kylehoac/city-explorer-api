'use strict'

// Load env data from the .env file
require('dotenv').config();

const superagent = require('superagent');
// App dependencies
const express = require('express');
const cors = require('cors');

// Dependencies
// REDUNDANT CODE
const weather = require('./data/weather.json');

// App Setup
const PORT = process.env.PORT
const app = express();
app.use(cors());

// Route Definitions
app.get('/weather', weatherHandler);
app.get('/movies', movieHandler);
// app/get('*', notFoundHandler)

class Forecast {
    constructor(day) {
        this.date = day.valid_date,
        this.description = day.weather.description
    }
}
class Movies {
    constructor(movie) {
        this.name = movie.title;
    }
}

async function movieHandler(request, response) {
    const cityName = request.query.cityName
    const key = process.env.MOVIE_API_KEY
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${cityName}`

    const movieResponse = await superagent.get(url);

    const movieObject = JSON.parse(movieResponse.text);

    const movieTitle = movieObject.results.map(movie => new Movies(movie));
    
    response.send(movieTitle);
}


async function weatherHandler(request, response) {

    const lat = request.query.lat;
    const lon = request.query.lon;

    const key = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

    const weatherResponse = await superagent.get(url);

    const weatherObject = JSON.parse(weatherResponse.text)

    const weatherArray = weatherObject.data;

    const forecasts = weatherArray.map(day => new Forecast(day));
    response.send(forecasts);
}
// renders woohoo on first screen
app.get('/', (request, response) => {
    response.send('WooHoo!')
});
app.get('*', (request, response) => {
    response.status(400,404,500).send('error: something went wrong');
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
