const superagent = require('superagent');


class Forecast {
    constructor(day) {
        this.date = day.valid_date,
        this.description = day.weather.description
    }
}

async function weatherHandler(request, response) {
try{
    const lat = request.query.lat;
    const lon = request.query.lon;

    const key = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

    const weatherResponse = await superagent.get(url);

    const weatherObject = JSON.parse(weatherResponse.text)

    const weatherArray = weatherObject.data;

    const forecasts = weatherArray.map(day => new Forecast(day));
    response.send(forecasts);
} catch(error){
    response.send('error: Something went wrong!')
}
}

module.exports = weatherHandler;