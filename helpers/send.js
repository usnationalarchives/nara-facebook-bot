'use strict';

const request = require( 'request' );
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const script = require( '../script/script' );

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

			// send a follow-up message
			if ( followUp ) {
				sendRequest( followUp, 'Follow-up message sent', false );
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
const sendMessage = ( user, response ) => {

	let json = {
		'messaging_type': 'RESPONSE',
		'recipient': {
			'id': user
		},
		'message': response
	};

	sendRequest( json, 'Message sent' );

};

/**
 * Prompt the user to continue the tagging loop.
 */
const promptContinue = ( startOrContinue = 'continue' ) => {

	let response = {
		'text': script['loop_'+startOrContinue],
		'quick_replies': [
			{
				'content_type': 'text',
				'title': 'Yes',
				'payload': 'new'
			},
			{
				'content_type': 'text',
				'title': 'No',
				'payload': 'exit'
			}
		]
	};

	return response;

};

module.exports.sendMessage = sendMessage;
module.exports.sendReceipt = sendReceipt;
module.exports.promptContinue = promptContinue;
