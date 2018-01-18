'use strict';

// ===== MODULES ===========================

// defaults

if ( process.env.NODE_ENV !== 'production' ) {
  const dotenv = require( 'dotenv' );
  dotenv.load();
}
const bodyParser = require( 'body-parser' );
const express = require( 'express' );

// routes

const index = require( './routes/index' );
const webhook = require( './routes/webhook' );

// ===== SERVER CONFIG =====================

const app = express();
app.set( 'port', ( process.env.PORT || 3001 ) );

// parsers

app.use( bodyParser.json() );

// routes

app.use( '/', index );
app.use( '/webhook', webhook );
app.use( function( req, res, next ) {
  res.sendStatus( 404 );
} );

// start

app.listen( app.get( 'port' ), () => {
  console.log( 'Webhook is listening on port ' + app.get( 'port' ) )
} );




// Set up HTTP server
/* const
  express    = require('express'),
  bodyParser = require('body-parser'),
  app        = express().use(bodyParser.json()); // creates express http server
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));
*/
/*
// Allow HTTP requests
const request = require('request');

// HTTP request validation
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// User state
const users = {};
*/
/**
 * Handle message events.
 */
/*function handleMessage(sender_psid, received_message) {

  if ( users[sender_psid].state === 'inactive' ) {
    inactiveState();
  }

  if ( users[sender_psid].state === 'active' ) {

    let response;

    // Check if the message contains text
    if ( received_message.text ) {

      let text;

      switch( received_message.text ) {

        case 'start' :
        case 'help' :
        case 'info' :
          text = 'Welcome to the National Archives Citizen Archivist Project! Help us identify text in historic images.';
          break;

        case 'score' :
        case 'stats' :
          text = 'Current score - how many images the user has ID\'d this session, or in total - requires db setup';
          break;

        case 'end' :
        case 'stop' :
        case 'exit' :
        case 'quit' :
        case 'q' :
          text = 'Thanks for playing! You helped process X images. Just send us another message to start again.';
          break;

        default :
          text = `I do not understand "${received_message.text}". I am just a bot.`;
          break;

      }

      response = { 'text' : text };

      // Create the payload for a basic text message
      // response = {
      //        'text': `You sent the message: "${received_message.text}". Now send me an image!`
      // }

    } else if (received_message.attachments) {

      // Get the URL of the first message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        'attachment': {
          'type':'template',
          'payload': {
            'template_type': 'generic',
            'elements': [{
              'title': 'Is this the right picture?',
              'subtitle': 'Tap a button to answer.',
              'image_url': attachment_url,
              'buttons': [
                {
                  'type': 'postback',
                  'title': 'Yes!',
                  'payload': 'yes'
                },
                {
                  'type': 'postback',
                  'title': 'No way.',
                  'payload': 'no'
                }
              ]
            }]
          }
        }
      }

    }

    // Sends the response message
    callSendAPI(sender_psid, response);

    if ( received_message.text && received_message.text === 'start' ) {
      newQuestion(sender_psid);
    }

  }

} */

/**
 * Inactive state.
 */
/* function inactiveState( sender_psid ) {

  let response = {
    'text': 'Hello! Nice to hear from you. Tap "Start" to start a session.',
    'quick_replies': [
      {
        'content_type': 'text',
        'title': 'Start session',
        'payload': 'start'
      }
    ]
  }

  sendMessage(sender_psid, response);

} */

/**
 * Start the session.
 */
/* function startSession( sender_psid ) {


  users[sender_psid].state = 'active';
  callSendAPI( sender_psid, {
    'text': 'Let\'s play!',
  }
} */

/**
 * End the session.
 */
// function endSession( sender_psid ) {
//   callSendAPI( sender_psid, {
//     'text': 'Thanks for playing!'
//   } );
//   users[sender_psid].state = 'inactive';
// }

/**
 * Handle postback events.
 */
// function handlePostback(sender_psid, received_postback) {

//   let response;

//   let payload = received_postback.payload;

//   let text;

//   /* if ( payload.indexOf( 'choice' ) !== -1 ) {
//     response = handleChoice( payload );
//   } */

//   switch( payload ) {

//     case 'continue' :
//       text = 'New question coming up.';
//       break;

//     case 'quit' :
//       text = 'Thanks for playing!';
//       break;

//     case 'typed' :
//       text = 'Marked as containing typed text.';
//       break;

//     case 'handwritten' :
//       text = 'Marked as containing handwritten text.';
//       break;

//     case 'mixed' :
//       text = 'Marked as containing both typed and handwritten text.';
//       break;

//     case 'none ':
//       text = 'Marked as not containing any text.';
//       break;

//     case 'skip' :
//     default :
//       text = 'No problem. Skipping this one.';
//       break;

//   }

//   if ( payload !== 'continue' && payload !== 'quit' ) {
//     response = {
//       'text' : text,
//       'quick_replies' : [
//         {
//           'content_type': 'text',
//           'title': 'Continue',
//           'payload': 'continue'
//         },
//         {
//           'content_type': 'text',
//           'title': 'Quit',
//           'payload': 'quit'
//         }
//       ]
//     }
//   } else {
//     response = {
//       'text' : text
//     }
//   }

//   // Send the message to acknowledge the postback.
//   callSendAPI(sender_psid, response);

//   if ( payload === 'continue' ) {
//     newQuestion( sender_psid );
//   }

//   if ( payload === 'quit' ) {
//     quitGame( sender_psid );
//   }

// }

// function newQuestion( sender_psid ) {

//   let response;
//   response = {
//       'text' : 'What kind of text is in this image?',
//       'quick_replies' : [
//         {
//           'content_type': 'text',
//           'title': 'Typed',
//           'payload': 'typed'
//         },
//         {
//           'content_type': 'text',
//           'title': 'Handwritten',
//           'payload': 'handwritten'
//         },
//         {
//           'content_type': 'text',
//           'title': 'Mixed',
//           'payload': 'mixed'
//         },
//         {
//           'content_type': 'text',
//           'title': 'No Writing',
//           'payload': 'none'
//         },
//         {
//           'content_type': 'text',
//           'title': 'Skip/Not sure',
//           'payload': 'skip'
//         }
//       ]
//     }
//   callSendAPI( sender_psid, response );

// }

/**
 * Send response messages via the Send API.
 */
// function callSendAPI(sender_psid, response) {

//   // Construct the message body
//   let request_body = {
//     'messaging_type': 'RESPONSE',
//     'recipient': {
//       'id': sender_psid
//     },
//     'message': response
//   }

//   // Send the HTTP request to the Messenger Platform
//   request({
//     'uri':'https://graph.facebook.com/v2.6/me/messages',
//     'qs': { 'access_token': PAGE_ACCESS_TOKEN },
//     'method': 'POST',
//     'json': request_body
//   }, (err, res, body) => {
//     if (!err) {
//       console.log('Message sent.');
//     } else {
//       console.error('Unable to send message: ' + err );
//     }
//   });

// }
