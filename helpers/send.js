/**
 * Helper functionality to send responses to users.
 */

'use strict';

const axios = require( 'axios' );
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

/**
 * Generic request handler. Attempt to send a response to a user,
 * retrying up to 5 times.
 */
const sendRequest = ( params, log = '', followUp = false, retries = 5 ) => {

	// error if we're out of retries
	if ( retries < 0 ) {
		console.error( 'No more retries left.', body );
		return;
	}

	params.access_token = PAGE_ACCESS_TOKEN;

	// attempt to send response
	axios.post( 'https://graph.facebook.com/v2.6/me/messages', params )
		.then( function( res ) {
			console.log( log );
			if ( followUp ) {
				sendMessage( params.recipient.id, followUp );
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
 * Get the raw json params needed to send a message.
 */
const buildParams = ( user, response ) => {
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

	sendRequest( params, '[typing indicator]' );

}

/**
 * Message handler. Send a message through sendRequest.
 */
const sendMessage = ( user, response, followUp = false ) => {
	showTyping( user );
	sendRequest( buildParams( user, response ), 'Message sent', followUp );
};

module.exports.buildResponse = buildResponse;
module.exports.sendReceipt = sendReceipt;
module.exports.showTyping = showTyping;
module.exports.sendMessage = sendMessage;
