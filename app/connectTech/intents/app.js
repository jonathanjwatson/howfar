'use strict';
require('dotenv').config()
const makeCard = require('./lib/makeCard.js'),
    ronSwansonApi = require('./lib/ronSwansonApi.js'),
    audiofiles = require('./lib/audiofile.js'),
    distanceApi = require('./lib/distanceApi.js'),
    _ = require('lodash');

/**
  * Watercooler contains all of the custom and built in intents we are using for the skill.
**/


let amazingApp = function (app) {
    app.makeCard = makeCard;
    app.ronSwansonApi = ronSwansonApi;
    app.audiofiles = audiofiles;
    app.distanceApi = distanceApi;
    app._ = _;

    /**
     * app.pre is run before every request.
     */
    // app.pre = function (request) {
    //
    // };


    /**
     *  Custom Intents:
     *      launch
     *      getRonSwansonQuote
     *      audioPlayer
     **/
     app.launch(function (request, response) {
         response.say('Hello! You can get the estimated drive time between two locations.');
         response.shouldEndSession(false, 'What did you say?').send();
     });

     app.intent('getRonSwansonQuote', (request, response) => {
         return app.ronSwansonApi.getQuote()
         .then( (quote) => {
             let finalQuote = quote;
             app.makeCard(finalQuote, response, 'ron');
             return response.say(`Ron Swanson Says: ${finalQuote}.
                                 Would you like to hear another quote?`)
                                 .shouldEndSession(false, 'Say that again?')
                                 .send();
         });
     });

     app.intent('audioPlayer', {
        slots: {START: 'START', END: 'END'}
    }, (request, response) => {
        let start = request.slot('START');
        let end = request.slot('END');
        return app.distanceApi.getTime(start, end)
        .then( (distanceObject) => {
            let time = distanceObject.routes[0].legs[0].duration.text;
            time = time.replace("mins", "minutes");
            return response.say(`Estimated time is ${time}`)
            .shouldEndSession(true)
            .send();
        }).catch((error) => {
            console.log('error', error);
        });
    });

    /**
     *  Amazon built-in intents:
     *      AMAZON.NextIntent,
     *      AMAZON.PauseIntent,
     *      AMAZON.ResumeIntent,
     *      AMAZON.StopIntent,
     *      AMAZON.CancelIntent
     *      AMAZON.HelpIntent
     **/
     app.intent('AMAZON.CancelIntent', (request, response) => {
         return response.say('Safe Travels!')
                             .shouldEndSession(true)
                             .send();
     });

};

module.exports = amazingApp;
