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
				sendApi.sendMessage( user, response, loop( 'start' ) );
				break;

			case 'help' :
			case 'info' :
				response = sendApi.buildResponse( script.help );
				sendApi.sendMessage( user, response, loop( 'continue' ) );
				break;

			case 'score' :
			case 'stats' :
				response = sendApi.buildResponse( script.score );
				sendApi.sendMessage( user, response, loop( 'continue' ) );
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
				sendApi.sendMessage( user, response, loop( 'continue' ) );
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
				let imageUrl = 'https://catalog.archives.gov/OpaAPI/media/44266074/content/stillpix/044-pf/44-pf-31-2016-001-ac.jpg';
				let imageThumb = 'https://catalog.archives.gov/OpaAPI/media/44266074//opa-renditions/thumbnails/44-pf-31-2016-001-ac.jpg-thumb.jpg';
				let imagePage = 'https://catalog.archives.gov/id/44266074';
				response = {
					'attachment': {
						'type': 'template',
						'payload': {
							'template_type': 'generic',
							'elements':[{
								'title': script.new,
								'image_url': imageThumb,
								'default_action': {
									'type': 'web_url',
									'url': imageUrl,
								},
								'buttons': [
									{
										'type':'web_url',
										'url':imageUrl,
										'title':'View larger size'
									},
									{
										'type':'web_url',
										'url':imagePage,
										'title':'About this image'
									}
								]
							}]
						}
					}
				};
				sendApi.sendMessage( user, response, loopChoices );
				break;

			case 'tag_typed' :
			case 'tag_handwritten' :
			case 'tag_mixed' :
			case 'tag_none' :
			case 'tag_skip' :
				response = sendApi.buildResponse( script[postback.payload] );
				sendApi.sendMessage( user, response, loop( 'continue' ) );
				break;

			default:
				response = sendApi.buildResponse( `You sent the postback: $(postback.payload)` );
				sendApi.sendMessage( user, response );
				break;

		}

	}

};

/**
 * Prompt choices within a loop.
 */
const loopChoices = () => {
	return {
		'text': script.promptTap,
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
}

/**
 * Prompt to start the loop again.
 */
const loop = ( startOrContinue ) =>  {
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
