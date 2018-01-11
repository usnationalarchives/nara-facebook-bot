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

    console.log( received_message );

    // Create the payload for a basic text message
    response = {
      'text': `You sent the message: "${received_message.text}". Now send me an image!`
    }

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

}

/**
 * Handle postback events.
 */
function handlePostback(sender_psid, received_postback) {

  let response;

  console.log( received_postback );

  // Get the payload for the postback
  let payload = received_postback.payload;
  if ( payload === 'yes' ) {
    response = { 'text': 'Thanks!' }
  } else if( payload === 'no' ) {
    response = { 'text': 'Looks like an error occurred, then.' }
  }

  // Send the message to acknowledge the postback.
  callSendAPI(sender_psid, response);

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
