const superagent = require('superagent');


class Forecast {
    constructor(day) {
        this.date = day.valid_date,
            this.description = day.weather.description
    }
}
const inMemoryDB = {};
async function weatherHandler(request, response) {
    const lat = request.query.lat;
    const lon = request.query.lon;
    try {
        const weatherAlreadyFound = inMemoryDB[lat + lon] !== undefined
        if (weatherAlreadyFound) {
            if (inMemoryDB[lat + lon].timestamp + 5000 < Date.now()) {
                console.log('old weather data')
                const key = process.env.WEATHER_API_KEY
                const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
    
                const weatherResponse = await superagent.get(url);
    
                const weatherObject = JSON.parse(weatherResponse.text)
    
                const weatherArray = weatherObject.data;
    
                const forecasts = weatherArray.map(day => new Forecast(day));
    
                inMemoryDB[lat + lon] = { forecasts, timestamp: Date.now() }
    
                response.status(200).send(inMemoryDB[lat + lon].forecasts);
            } else {
                console.log('good data')
                const forecasts = inMemoryDB[lat + lon].forecasts;
                response.status(200).send(forecasts)
            }
        } else {
            console.log('no data')
            const key = process.env.WEATHER_API_KEY
            const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

            const weatherResponse = await superagent.get(url);

            const weatherObject = JSON.parse(weatherResponse.text)

            const weatherArray = weatherObject.data;

            const forecasts = weatherArray.map(day => new Forecast(day));

            inMemoryDB[lat + lon] = { forecasts, timestamp: Date.now() }

            response.status(200).send(forecasts);
        }
    } catch (error) {
        response.send('error: Something went wrong!')
    }
}

module.exports = weatherHandler;