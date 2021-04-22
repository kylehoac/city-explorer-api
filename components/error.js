function errorHandler(request, response) {
    response.status(400,404,500).send('error: something went wrong');
}

module.exports = errorHandler; 