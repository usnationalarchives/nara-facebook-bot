'use strict';

const request = require( 'request' );
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

/**
 * Generic request handler. Attempt to send a response to a user,
 * retrying up to 5 times.
 */
const sendRequest = ( json, log = '', followUp = false, retries = 5 ) => {

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
		'json': json,
	}, ( err, res, body ) => {

		if ( !err ) {
			console.log( log );
			console.log( 'followUp:' );
			console.log( followUp );

			// send a follow-up message
			if ( followUp ) {
				sendMessage( json.recipient.id, followUp );
			}

		} else {
			// retry if the message failed
			console.error( 'Unable to send message: ', err );
			console.log( `Retrying request: $(retries) left` );
			sendRequest( json, log, followUp, retries - 1 );
		}

	} );

};

/**
 * Get the raw json object needed to send a message.
 */
const buildJson = ( user, response ) => {
	return {
		'messaging_type': 'RESPONSE',
		'recipient': {
			'id': user
		},
		'message': response
	};
};

/**
 * Get a generic text message object.
 */
const buildResponse = ( text, quick_replies ) =>  {
	let response = {
		'text': text
	};
	if ( quick_replies ) {
		response.quick_replies = quick_replies;
	}
	return response;
}

/**
 * Receipt handler. Send the user a read receipt.
 */
const sendReceipt = ( user ) => {

	let json = {
		recipient: {
			id: user,
		},
		sender_action: 'mark_seen',
	};

	sendRequest( json, 'Read receipt sent' );

};

/**
 * Message handler. Send a message through sendRequest.
 */
const sendMessage = ( user, response, followUp = false ) => {
	sendRequest( buildJson( user, response ), 'Message sent', followUp );
};

module.exports.buildJson = buildJson;
module.exports.buildResponse = buildResponse;
module.exports.sendReceipt = sendReceipt;
module.exports.sendMessage = sendMessage;
