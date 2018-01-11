'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

// Import dependencies and set up http server
const
  express           = require('express'),
  bodyParser        = require('body-parser'),
  app               = express().use(bodyParser.json()), // creates express http server
  request           = require('request'),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Set server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));

/**
 * Create webhook endpoint for POST requests: receive messages and funnel
 * them to the appropriate function.
 */
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Check this is an event from a FB page
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // entry.messaging is array, but will only ever contain one message
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Determine if event is a message or a postback
      if (webhook_event.message) {
        handleMessage(webhook_event.sender.id, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(webhook_event.sender.id, webhook_event.postback);
      }

    });

    res.status(200).send('EVENT_RECEIVED');

  } else {
    res.sendStatus(404);
  }

});

/**
 * Create webhook endpoint for GET requests. This is used specifically to
 * verify the webhook when setting up the app.
 */
app.get('/webhook', (req, res) => {

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode      = req.query['hub.mode'];
  let token     = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      res.sendStatus(403);
    }

  }
});

/**
 * Handle message events.
 */
function handleMessage(sender_psid, received_message) {

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
    /* response = {
      'text': `You sent the message: "${received_message.text}". Now send me an image!`
    } */

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

/**
 * Handle postback events.
 */
function handlePostback(sender_psid, received_postback) {

  let response;

  let payload = received_postback.payload;

  let text;

  /* if ( payload.indexOf( 'choice' ) !== -1 ) {
    response = handleChoice( payload );
  } */

  switch( payload ) {

    case 'continue' :
      text = 'New question coming up.';
      break;

    case 'quit' :
      text = 'Thanks for playing!';
      break;

    case 'typed' :
      text = 'Marked as containing typed text.';
      break;

    case 'handwritten' :
      text = 'Marked as containing handwritten text.';
      break;

    case 'mixed' :
      text = 'Marked as containing both typed and handwritten text.';
      break;

    case 'none ':
      text = 'Marked as not containing any text.';
      break;

    case 'skip' :
    default :
      text = 'No problem. Skipping this one.';
      break;

  }

  if ( payload !== 'continue' && payload !== 'quit' ) {
    response = {
      'text' : text,
      'quick_replies' : [
        {
          'content_type': 'text',
          'title': 'Continue',
          'payload': 'continue'
        },
        {
          'content_type': 'text',
          'title': 'Quit',
          'payload': 'quit'
        }
      ]
    }
  } else {
    response = {
      'text' : text
    }
  }

  // Send the message to acknowledge the postback.
  callSendAPI(sender_psid, response);

  if ( payload === 'continue' ) {
    newQuestion( sender_psid );
  }

  if ( payload === 'quit' ) {
    quitGame( sender_psid );
  }

}

function newQuestion( sender_psid ) {

  response = {
      'text' : 'What kind of text is in this image?',
      'quick_replies' : [
        {
          'content_type': 'text',
          'title': 'Typed',
          'payload': 'typed'
        },
        {
          'content_type': 'text',
          'title': 'Handwritten',
          'payload': 'handwritten'
        },
        {
          'content_type': 'text',
          'title': 'Mixed',
          'payload': 'mixed'
        },
        {
          'content_type': 'text',
          'title': 'No Writing',
          'payload': 'none'
        },
        {
          'content_type': 'text',
          'title': 'Skip/Not sure',
          'payload': 'skip'
        }
      ]
    }
  callSendAPI( sender_psid, response );

}

function quitGame( sender_psid ) {

  callSendAPI( sender_psid, { 'text': 'Thanks for playing!' } );

}

/**
 * Send response messages via the Send API.
 */
function callSendAPI(sender_psid, response) {

  // Construct the message body
  let request_body = {
    'recipient': {
      'id': sender_psid
    },
    'message': response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    'uri':'https://graph.facebook.com/v2.6/me/messages',
    'qs': { 'access_token': PAGE_ACCESS_TOKEN },
    'method': 'POST',
    'json': request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('Message sent!');
    } else {
      console.error('Unable to send message: ' + err );
    }
  });

}
