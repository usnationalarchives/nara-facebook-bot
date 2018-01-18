'use strict';

const sendApi = require( './send' );
const script = require( '../script/script' );

/**
 * Receive a text message and return a response.
 */
const receiveMessage = ( user, message ) => {

	sendApi.sendReceipt( user );

	if ( message.text ) {

		let text;
		let promptContinue = false;

		switch( message.text ) {

			case 'start' :
			case 'begin' :
				text = script.welcome;
				promptContinue = true;
				break;

			case 'help' :
			case 'info' :
				text = script.help;
				promptContinue = true;
				break;

			case 'score' :
			case 'stats' :
				text = script.score;
				promptContinue = true;
				break;

			case 'end' :
			case 'stop' :
			case 'exit' :
			case 'quit' :
			case 'q' :
				text = script.exit;
				break;

			default :
				text = script.default;
				promptContinue = true;
				break;
		}

		let response = { 'text': text };

		if ( promptContinue ) {
			sendApi.sendMessage( user, response, sendApi.promptContinue( 'continue' ) );
		} else {
			sendApi.sendMessage( user, response );
		}

	}

};

/**
 * Receive a postback and return a response based on the payload.
 */
const receivePostback = ( user, postback ) => {

	if ( postback.payload ) {

		let response;
		let promptContinue = false;

		switch( postback.payload ) {

			case 'exit' :
				response = {
					'text': script.exit
				};
				break;

			case 'new' :
				response = {
					'text': script.new,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': 'Typed',
							'payload': 'tag_typed'
						},
						{
							'content_type': 'text',
							'title': 'Handwritten',
							'payload': 'tag_handwritten'
						},
						{
							'content_type': 'text',
							'title': 'Mixed',
							'payload': 'tag_mixed'
						},
						{
							'content_type': 'text',
							'title': 'No Writing',
							'payload': 'tag_none'
						},
						{
							'content_type': 'text',
							'title': 'Skip/Not sure',
							'payload': 'tag_skip'
						}
					]
				};
				break;

			case 'tag_typed' :
			case 'tag_handwritten' :
			case 'tag_mixed' :
			case 'tag_none' :
			case 'tag_skip' :
				response = {
					'text': script[postback.payload]
				}
				promptContinue = true;
				break;

			default:
				response = {
					'text': `You sent the postback: $(postback.payload)`
				};
				break;

		}

		sendApi.sendMessage( user, response );

		if ( promptContinue ) {
			sendApi.promptContinue( user, 'continue' );
		}

	}

};

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
