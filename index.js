'use strict';
const Alexa = require('ask-sdk-core');
const { getLocation, getWeather } = require('./darkSky');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = "Welcome to Weather Reporter, you can say what's the weather in Seattle";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const WeatherForecastIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.SearchAction<object@WeatherForecast>';
    },
    async handle(handlerInput) {

        try {
            const city = handlerInput.requestEnvelope.request.intent.slots['object.location.addressLocality.name'].value;
            const loc = await getLocation(city);
            const weather = await getWeather(loc.geometry.location.lat, loc.geometry.location.lng);
            const speechText = weather.daily.summary;
            return handlerInput.responseBuilder
                .speak(speechText)
                .withShouldEndSession(false)
                .getResponse();
        } catch (ex) {
            console.log('Error in getting weather', ex)
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = "Welcome to Weather Reporter, you can say what's the weather in Seattle";
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye! Have a nice day';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder
            .speak('Sorry, I didn\'t understand')
            .withShouldEndSession(false)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

// register handlers
exports.handler = Alexa.SkillBuilders
    .custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        WeatherForecastIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .lambda();