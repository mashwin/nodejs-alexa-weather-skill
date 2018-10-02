let request = require('request');
require('dotenv').config();

// method to retrieve lat and lng for city
const getLocation = (cityName) => {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://maps.googleapis.com/maps/api/geocode/json?',
            method: 'POST',
            json: true,
            qs: {
                address: cityName,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body.results[0]);
            } else {
                reject(error);
            }
        });
    });
}

// method to retrieve weather information from lat and lng
const getWeather = (lat, lng) => {
    return new Promise((resolve, reject) => {
        request({
            uri: `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${lat},${lng}`,
            method: 'GET',
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

module.exports = {
    getLocation,
    getWeather
}