/**
 * Logic for what to do when receiving messages from users. Parse
 * messages/postbacks and send a response with the sendApi.
 */

'use strict';

const sendApi = require( './send' );
const script = require( './script' );
const axios = require( 'axios' );

/**
 * Receive a text message, interpret it, and return a response.
 */
const receiveMessage = ( user, message ) => {

	if ( message.text ) {

		// clean up message
		message.text = message.text.trim();
		message.text = message.text.toLowerCase();

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
				getNaraItem( user );
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

/**
 * Query NARA catalog and return an item.
 */
const getNaraItem = ( user ) => {

	// randomize result - @todo need to get 4586 dynamically
	let offset = Math.floor( Math.random() * Math.floor( 4586 ) ) + 1;

	let url = 'https://catalog.archives.gov/api/v1'
			  + '?q=speeches'
			  + '&resultTypes=item'
			  + '&description.item.generalRecordsTypeArray.generalRecordsType.naId=10035676' // Textual Records
			  + '&rows=1'
			  + '&offset=' + offset;

	// testable url:
	// https://catalog.archives.gov/api/v1?q=speeches&resultTypes=item&description.item.generalRecordsTypeArray.generalRecordsType.naId=10035676&rows=1&offset=796

	axios.get( url )
		.then( function( res ) {
			console.log( res.data.opaResponse.results );

			let result = res.data.opaResponse.results.result[0];
			let objects = result.objects.object;

			// standardize objects
			if ( ! Array.isArray( objects ) ) {
				objects = [ objects ];
			}

			sendApi.sendMessage( user, sendApi.buildResponse( result.description.item.title + ':' ) );

			let elements = [];

			objects.forEach( ( object ) => {
				elements.push( {
					'image_url': object.thumbnail['@url'],
					'default_action': {
						'type': 'web_url',
						'url': object.file['@url']
					},
					'buttons': [
						{
							'type': 'web_url',
							'url': object.file['@url'],
							'title': 'View larger size'
						}
					]
				} );
			} );

			let response = {
				'attachment': {
					'type': 'template',
					'payload': {
						'template_type': 'generic',
						'elements': elements
					}
				}
			};

			sendApi.sendMessage( user, response, loopChoices() );

		} )
		.catch( function( error ) {
			console.log( error.response.data );
			// @todo send error message to user?
		} );

}

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
