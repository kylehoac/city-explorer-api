'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const weather = require('./data/weather.json')
const app = express();

app.use(cors());

app.get('/', (request, response) => {
    response.send('WooHoo!')
});

app.get('/weather', (request, response) => {
    const weatherArray = weather.data.map(day => new Forecast(day));
    response.send(weatherArray);
});

function Forecast(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
