'use strict';

const sendApi = require( './send' );
const script = require( '../script/script' );

/**
 * Receive a text message, interpret it, and return a response.
 */
const receiveMessage = ( user, message ) => {

	sendApi.sendReceipt( user );

	if ( message.text ) {

		let response;

		switch( message.text ) {

			case 'start' :
			case 'begin' :
				response = sendApi.buildResponse( script.welcome );
				sendApi.sendMessage( user, response, followUp( 'start' ) );
				break;

			case 'help' :
			case 'info' :
				response = sendApi.buildResponse( script.help );
				sendApi.sendMessage( user, response, followUp( 'continue' ) );
				break;

			case 'score' :
			case 'stats' :
				response = sendApi.buildResponse( script.score );
				sendApi.sendMessage( user, response, followUp( 'continue' ) );
				break;

			case 'end' :
			case 'stop' :
			case 'exit' :
			case 'quit' :
			case 'q' :
				response = sendApi.buildResponse( script.exit );
				sendApi.sendMessage( user, response );
				break;

			default :
				response = sendApi.buildResponse( script.default );
				sendApi.sendMessage( user, response, followUp( 'continue' ) );
				break;

		}

	}

};

/**
 * Receive a postback or quick reply, interpret it, and
 * return a response based on the payload.
 */
const receivePostback = ( user, postback ) => {

	if ( postback.payload ) {

		let response;

		switch( postback.payload ) {

			case 'exit' :
				response = sendApi.buildResponse( script.exit );
				sendApi.sendMessage( user, response );
				break;

			case 'new' :
				response = sendApi.buildResponse( script.new, [
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
				] );
				sendApi.sendMessage( user, response );
				break;

			case 'tag_typed' :
			case 'tag_handwritten' :
			case 'tag_mixed' :
			case 'tag_none' :
			case 'tag_skip' :
				response = sendApi.buildResponse( script[postback.payload] );
				sendApi.sendMessage( user, response, followUp( 'continue' ) );
				break;

			default:
				response = sendApi.buildResponse( `You sent the postback: $(postback.payload)` );
				sendApi.sendMessage( user, response );
				break;

		}

	}

};

/**
 * Queue up a followup message.
 */
const followUp = ( startOrContinue ) =>  {
	return {
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
}

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
