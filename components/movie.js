const superagent = require('superagent');

class Movies {
    constructor(movie) {
        this.name = movie.title;
        this.overview = movie.overview;
        this.popularity = movie.popularity;
        this.image = movie.poster_path;
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

module.exports = movieHandler;