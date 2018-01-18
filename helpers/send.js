'use strict';

const request = require( 'request' );
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

/**
 * Generic request handler. Attempt to send a response to a user,
 * retrying up to 5 times.
 */
const sendRequest = ( response, retries = 5 ) => {

	// error if we're out of retries
	if ( retries < 0 ) {
		console.error( 'No more retries left.', body );
		return;
	}

	// attempt to send response
	request( {
		'uri': 'https://graph.facebook.com/v2.6/me/messages',
		'qs': { 'access_token': PAGE_ACCESS_TOKEN },
		'method': 'POST',
		'json': response,
	}, ( err, res, body ) {

		if ( !err ) {
			console.log( 'Message sent' );
		} else {
			// retry if the message failed
			console.error( 'Unable to send message: ', err );
			console.log( `Retrying request: $(retries) left` );
			sendRequest( response, retries - 1 );
		}

	} );

};

/**
 * Message handler. Send a message through sendRequest.
 */
const sendMessage = ( user, message ) => {

	let response = {
		'messaging_type': 'RESPONSE',
		'recipient': {
			'id': user
		},
		'message': message
	};

	sendRequest( response );

}

/**
 * Receipt handler. Send the user a read receipt.
 */
const sendReceipt = ( user ) => {

	let response = {
		recipient: {
			id: user,
		},
		sender_action: 'mark_seen',
	};

	sendRequest( response );

} );

module.exports.sendMessage = sendMessage;
module.exports.sendReceipt = sendReceipt;
