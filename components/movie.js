const superagent = require('superagent');

class Movies {
    constructor(movie) {
        this.name = movie.title;
        this.overview = movie.overview;
        this.popularity = movie.popularity;
        this.image = movie.poster_path;
    }
}
const inMemoryDB = {};
async function movieHandler(request, response) {
    const cityName = request.query.cityName
    try {
        const movieAlreadyFound = inMemoryDB[cityName] !== undefined;
        if (movieAlreadyFound) {
            if (inMemoryDB[cityName].timestamp + 5000 < Date.now()) {
                console.log('old movie data')
                const key = process.env.MOVIE_API_KEY
                const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${cityName}`
    
                const movieResponse = await superagent.get(url);
    
                const movieObject = JSON.parse(movieResponse.text);
    
                const movieTitle = movieObject.results.map(movie => new Movies(movie));
    
                inMemoryDB[cityName] = { movies: movieTitle, timestamp: Date.now() }
                response.status(200).send(inMemoryDB[cityName].movies);
            } else {
                console.log('good data')
                const movies = inMemoryDB[cityName].movies;
                response.status(200).send(movies);
            }
        } else {
            console.log('no data')
            const key = process.env.MOVIE_API_KEY
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${cityName}`

            const movieResponse = await superagent.get(url);

            const movieObject = JSON.parse(movieResponse.text);

            const movieTitle = movieObject.results.map(movie => new Movies(movie));

            inMemoryDB[cityName] = { movies: movieTitle, timestamp: Date.now() }
            response.status(200).send(inMemoryDB[cityName].movies);
        }
    } catch (error) {
        response.send('error: Something went wrong!')
    }
}
module.exports = movieHandler;