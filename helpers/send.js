/**
 * Helper functionality to send responses to users.
 */

'use strict';

const axios = require( 'axios' );

/**
 * Generic request handler. Attempt to send a response to a user,
 * retrying up to 5 times.
 */
const sendRequest = ( type = '', params, followUps = false, retries = 5 ) => {

	// error if we're out of retries
	if ( retries < 0 ) {
		console.error( 'No more retries left.', body );
		return;
	}

	params.access_token = process.env.PAGE_ACCESS_TOKEN;

	// attempt to send response
	axios.post( 'https://graph.facebook.com/v2.6/me/messages', params )
		.then( function( res ) {
			console.log( type );

			if ( followUps ) {

				switch( type ) {

					// if there's a followUp message, turn typing on and pass it along
					case 'message' :
						typingOn( params.recipient.id, followUps );
						break;

					// if typing is on, output the first followup message
					case 'typing_on' :

						// if followUps true but unspecified, just end with the typing indicator still on
						if ( followUps === true ) {
							break;
						}

						// ensure followUps is array
						if ( ! Array.isArray( followUps ) ) {
							followUps = [ followUps ];
						}

						// extract first followUp
						let followUp = followUps.shift();

						// send new message
						sendMessage( params.recipient.id, followUp, followUps );
						break;

				}

			} else {

				// since there's nothing to follow up, ensure typing is off
				typingOff( params.recipient.id );

			}

		} )
		.catch( function( err ) {
			// retry if the message failed
			console.error( 'Unable to send message: ', err );
			console.log( 'Retrying request: ' + retries + ' left' );
			sendRequest( type, params, followUps, retries - 1 );
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

	let params = {
		'messaging_type': 'RESPONSE',
		'recipient': {
			'id': user
		},
		'message': response
	}

	sendRequest( 'message', params, followUps );

};

/**
 * Receipt handler. Send the user a read receipt.
 */
const sendReceipt = ( user ) => {

	let params = {
		'recipient': {
			'id': user,
		},
		'sender_action': 'mark_seen',
	};

	sendRequest( 'receipt', params );

};

/**
 * Send the user a typing indicator.
 */
const typingOn = ( user, followUps = false ) =>  {

	let params = {
		'recipient': {
			'id': user,
		},
		'sender_action': 'typing_on',
	};

	sendRequest( 'typing_on', params, followUps );

}

/**
 * Turn off the typing indicator.
 */
const typingOff = ( user ) =>  {

	let params = {
		'recipient': {
			'id': user,
		},
		'sender_action': 'typing_off',
	};

	sendRequest( 'typing_off', params );

}

module.exports.sendMessage = sendMessage;
module.exports.sendReceipt = sendReceipt;
module.exports.typingOn = typingOn;
module.exports.typingOff = typingOff;
