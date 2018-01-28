/**
 * Helper functionality to send responses to users.
 */

'use strict';

const axios = require( 'axios' );

/**
 * Generic request handler. Attempt to send a response to a user,
 * retrying up to 5 times.
 */
const sendRequest = ( params, log = '', followUps = false, retries = 5 ) => {

	// error if we're out of retries
	if ( retries < 0 ) {
		console.error( 'No more retries left.', body );
		return;
	}

	params.access_token = process.env.PAGE_ACCESS_TOKEN;

	// attempt to send response
	axios.post( 'https://graph.facebook.com/v2.6/me/messages', params )
		.then( function( res ) {
			console.log( log );

			if ( followUps ) {

				// ensure followUps is array
				if ( ! Array.isArray( followUps ) ) {
					followUps = [ followUps ];
				}

				// take first followUp
				let followUp = followUps.shift();

				// send as new message
				sendMessage( params.recipient.id, followUp, followUps );

			}

		} )
		.catch( function( err ) {
			// retry if the message failed
			console.error( 'Unable to send message: ', err );
			console.log( `Retrying request: $(retries) left` );
			sendRequest( params, log, followUp, retries - 1 );
		} );

};

/**
 * Message handler. Send a message through sendRequest.
 */
const sendMessage = ( user, response, followUps = false ) => {

	// if response is just a string, assume it's a basic text message
	if ( typeof response === 'string' || response instanceof String ) {
		response = {
			'text': response
		};
	}

	// wrap response in message syntax
	let message = {
		'messaging_type': 'RESPONSE',
		'recipient': {
			'id': user
		},
		'message': response
	}

	sendRequest( message, 'Message sent', followUps );

};

/**
 * Receipt handler. Send the user a read receipt.
 */
const sendReceipt = ( user ) => {

	let params = {
		recipient: {
			id: user,
		},
		sender_action: 'mark_seen',
	};

	sendRequest( params, 'Read receipt sent' );

};

/**
 * Send the user a typing indicator.
 */
const showTyping = ( user ) =>  {

	let params = {
		recipient: {
			id: user,
		},
		sender_action: 'typing_on',
	};

	sendRequest( params, 'Typing shown' );

}

module.exports.sendMessage = sendMessage;
module.exports.sendReceipt = sendReceipt;
module.exports.showTyping = showTyping;
