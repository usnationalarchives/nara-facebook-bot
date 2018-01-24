/**
 * Route for /webhook.
 *
 * Create endpoints for GET and POST requests.
 */

'use strict';

const express = require( 'express' );
const receiveApi = require( '../helpers/receive' );
const sendApi = require( '../helpers/send' );
const router = express.Router();

/**
 * Create webhook endpoint for GET requests. This is used specifically
 * so that Facebook can verify they have the correct webhook location
 * for this app.
 *
 * The webhook token must be set in the app's configuration page on
 * Facebook as well as in this server environment.
 */
router.get( '/', ( req, res ) => {

	// parse the query params
	let mode      = req.query['hub.mode'];
	let token     = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	// check if a token and mode is in the query string of the request
	if ( mode && token ) {

		// check the mode and token sent are correct
		if ( mode === 'subscribe' && token === process.env.VERIFY_TOKEN ) {

			// respond with the challenge token from the request
			res.status( 200 ).send( challenge );

		} else {
			res.sendStatus( 403 );
		}

	} else {
		res.sendStatus( 403 );
	}

} );

/**
 * Create webhook endpoint for POST requests. This is where all messages
 * from users will be received.
 */
router.post( '/', ( req, res ) => {

	// check if this is an event for a FB page
	if ( req.body.object === 'page' ) {

		// send a success back asap to avoid timeouts
		res.sendStatus( 200 );

		// iterate over each entry (there may be multiple if batched)
		req.body.entry.forEach( function( entry ) {

			if ( !entry.messaging ) {
				return;
			}

			entry.messaging.forEach( ( messagingEvent ) => {

				console.log( messagingEvent );

				sendApi.sendReceipt( messagingEvent.sender.id );

				if ( messagingEvent.message ) {
					if ( messagingEvent.message.quick_reply ) {
						receiveApi.receivePostback( messagingEvent.sender.id, messagingEvent.message.quick_reply );
					} else {
						receiveApi.receiveMessage( messagingEvent.sender.id, messagingEvent.message );
					}

				} else if ( messagingEvent.postback ) {
					receiveApi.receivePostback( messagingEvent.sender.id, messagingEvent.postback );

				} else {
					console.error( 'Webhook received unknown messagingEvent: ', messagingEvent );
				}

			} );

		} );

	} else {
		res.sendStatus( 404 );
	}

} );

module.exports = router;
