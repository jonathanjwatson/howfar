'use strict';
require('dotenv').config()

const config = require('../../config/config'),
    request = require('request-promise'),
    baseURL = config.get('distanceApi').v1.url;

    let api;

function getTime(start, end) {
    console.log('start', start);
    console.log('end', end);
    let URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    console.log(URL);
    let options = {
        method: 'GET',
        uri: URL,
        transform: function (quote) {
            quote = JSON.parse (quote);
            return quote;
        }
    };
return request(options);
}

api = {
    getTime: getTime
};

module.exports = api;
