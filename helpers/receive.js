'use strict';

const sendApi = require( './send' );

/**
 * Receive a text message and return a response.
 */
const receiveMessage = ( user, message ) => {

	sendApi.sendReceipt( user );

	if ( message.text ) {
		let response = {
			'text' : `You sent the message: $(message.text)`
		};
		sendApi.sendMessage( user, response );
	}

};

/**
 * Receive a postback and return a response based on the payload.
 */
const receivePostback = ( user, postback ) => {

	let response;

	switch( postback.payload ) {
		default:
			response = {
				'text': `You sent the postback: $(postback.payload)`
			};
			break;
	}

	sendApi.sendMessage( user, response );

};

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
