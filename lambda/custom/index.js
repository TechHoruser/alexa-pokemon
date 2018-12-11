/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const data = require('./data');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Bienvenido a pokeguía, si necesitas ayuda solo tienes que pedirla';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Saludo de carga', speechText)
      .getResponse();
  },
};

const SaludoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SaludoIntent';
  },
  handle(handlerInput) {
    const speechText = 'Bienvenido a pokeguía, si necesitas ayuda solo tienes que pedirla';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt()
      .withSimpleCard('Saludo', speechText)
      .getResponse();
  },
};

const NumeroPokemonIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NumeroPokemonIntent';
  },
  handle(handlerInput) {
    const numeroPokemon = handlerInput.requestEnvelope.request.intent.slots['numeroPokemon'];
    try {
      pokemon = data.pokemons[parseInt(numeroPokemon['value'])];
      returnText = 'El pokemon es ' + pokemon['nombre'];
    } catch (e) {
      returnText = 'El pokemon ' + numeroPokemon['value'] + ' no se encuentra registrado.';
    }
    return handlerInput.responseBuilder
      .speak(returnText)
      .reprompt()
      .withSimpleCard('Numero Pokemon', returnText)
      .getResponse();
  },
};

const TipoPokemonIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TipoPokemonIntent';
  },
  handle(handlerInput) {
    const nombrePokemon = handlerInput.requestEnvelope.request.intent.slots['nombrePokemon'];
    try {
      var pokemon = getPokemon(nombrePokemon['value']);
      returnText = nombrePokemon['value'] + ' es de tipo ' + pokemon.tipos.join(' y ');
    } catch (e) {
      returnText = 'El pokemon ' + nombrePokemon['value'] + ' no se encuentra registrado.';
    }
    return handlerInput.responseBuilder
      .speak(returnText)
      .reprompt()
      .withSimpleCard('Tipo Pokemon', returnText)
      .getResponse();
  },
};

const InfoPokemonIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'InfoPokemonIntent';
  },
  handle(handlerInput) {
    console.log('INFO POKEMON');
    const nombrePokemon = handlerInput.requestEnvelope.request.intent.slots['nombrePokemon'];
    try {
      var pokemon = getPokemon(nombrePokemon['value']);
      console.log(pokemon);
      returnText = pokemon.info;
      console.log(returnText);
    } catch (e) {
      returnText = 'El pokemon ' + nombrePokemon['value'] + ' no se encuentra registrado.';
    }
    return handlerInput.responseBuilder
      .speak(returnText)
      .reprompt()
      .withSimpleCard('Info Pokemon', 'info')
      .getResponse();
  },
};

const EvolucionPokemonIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'EvolucionPokemonIntent';
  },
  handle(handlerInput) {
    const nombrePokemon = handlerInput.requestEnvelope.request.intent.slots['nombrePokemon'];
    try {
      var pokemon = getPokemon(nombrePokemon['value']);

      if(pokemon.evos.length == 0){
        returnText = nombrePokemon['value'] + ' no tiene ninguna evolución';
      } else {
        var evos = [];
        for(var element in pokemon.evos){
          iter = pokemon.evos[element];
          evos.push(data.pokemons[iter.pokemon].nombre + ' ' + iter.motivo);
        }

        returnText = nombrePokemon['value'] + ' evoluciona en ' + evos.join(', ');
      }

    } catch (e) {
      returnText = 'El pokemon ' + nombrePokemon['value'] + ' no se encuentra registrado.';
    }
    return handlerInput.responseBuilder
      .speak(returnText)
      .reprompt()
      .withSimpleCard('Evolucion Pokemon', returnText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Por ejemplo. Puedes preguntarme qué pokemon es el número 32 o de qué tipo es Venusaur.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt()
      .withSimpleCard('Ayuda', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = '¡Adiós!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Cierre', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error capturado: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Error capturado: '+error.message)
      .reprompt()
      .getResponse();
  },
};

function getPokemon(pokemonName) {
  for(var element in data.pokemons){
    iter = data.pokemons[element];
    if(pokemonName.toLowerCase() == iter['nombre'].toLowerCase()) {
      return iter;
    }
  }

  return null;
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SaludoIntentHandler,
    NumeroPokemonIntentHandler,
    TipoPokemonIntentHandler,
    InfoPokemonIntentHandler,
    EvolucionPokemonIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
