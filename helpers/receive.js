/**
 * Logic for what to do when receiving messages from users. Parse
 * messages/postbacks and send a response with the sendApi.
 */

'use strict';

const sendApi = require( './send' );
const script = require( './script' );
const catalogApi = require( './catalog' );

/**
 * Receive a text message, interpret it, and return a response.
 */
const receiveMessage = ( user, message ) => {

	if ( message.text ) {

		// clean up message
		message.text = message.text.trim();
		message.text = message.text.toLowerCase();
		message.text = message.text.replace( /[^\w\s]/g, '' );

		switch( message.text ) {

			case 'start' :
			case 'begin' :
			case 'help' :
			case 'info' :
				sendApi.sendMessage( user, script.get_started );
				break;

			case 'end' :
			case 'stop' :
			case 'exit' :
			case 'quit' :
			case 'q' :
				sendApi.sendMessage( user, script.quit.stop );
				break;

			default :
				sendApi.sendMessage( user, script.default );
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

		/**
		 * Check if the payload is a JSON string and retrieve arguments
		 * if it is.
		 */
		let payloadObj = {
			'tag_round_count': 0,
			'new_message': script.tag_start,
			'stop_message': script.switch_section,
		};

		// all json strings should include 'type': 'JSON'
		if ( postback.payload.includes( 'JSON' ) ) {

			// merge passed object into payloadObj
			payloadObj = Object.assign( payloadObj, JSON.parse( postback.payload ) );

			// set postback.payload back to a string
			postback.payload = payloadObj.name;

		}

		switch( postback.payload ) {

			/**
			 * Trigger the welcome message & options.
			 */
			case 'get_started' :
				sendApi.sendMessage( user, {
					'text': script.get_started,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.menu.tag,
							'payload': 'menu.tag'
						},
						{
							'content_type': 'text',
							'title': script.menu.ask,
							'payload': 'menu.ask'
						}
					]
				} );
				break;

			/**
			 * Prompt the user to visit a new section. Triggered when the user indicates
			 * they want to leave their current section.
			 */
			case 'switch.tag' :
			case 'switch.photos' :
			case 'switch.facts' :
			case 'switch.ask' :

				let parts = postback.payload.split( '.' );
				let section = parts[1];
				let sections = [ 'tag', 'photos', 'facts', 'ask' ];
				let quickReplies = [];

				for( let i = 0; i < 4; i++ ) {
					if ( section !== sections[i] ) {
						quickReplies.push( {
							'content_type': 'text',
							'title': script.menu[section],
							'payload': 'menu.' + section
						} );
					}
				}

				if ( postback.payload === 'switch.tag' && payloadObj.stop_message !== script.switch_section ) {

					// send a custom message before the switch_section prompt
					sendApi.sendMessage( user, payloadObj.stop_message, {
						'text': script.switch_section,
						'quick_replies': quickReplies
					} );

				} else {

					sendApi.sendMessage( user, {
						'text': payloadObj.stop_message,
						'quick_replies': quickReplies
					} );

				}

				break;

			/**
			 * Ask a Question section.
			 */
			case 'menu.ask' :
				sendApi.sendMessage( user, script.ask_temp );
				break;

			/**
			 * Interesting Photos section.
			 */
			case 'menu.photos' :

				// get a random number
				let photoNum = Math.floor( Math.random() * script.photos.length );

				// get a photo
				catalogApi.getPhoto( user, script.photos[photoNum] );

				break;

			/**
			 * Fun Facts section.
			 */
			case 'menu.facts' :

				// get a random number
				let factNum = Math.floor( Math.random() * script.facts.length );

				// is string?
				if ( typeof script.facts[factNum] === 'string' || script.facts[factNum] instanceof String ) {

					// show the fact & followup
					sendApi.sendMessage( user, script.facts[factNum], {
						'text': script.facts_reply.message,
						'quick_replies': [
							{
								'content_type': 'text',
								'title': script.facts_reply.options.continue,
								'payload': 'menu.facts'
							},
							{
								'content_type': 'text',
								'title': script.facts_reply.options.stop,
								'payload': 'switch.facts',
							}
						]
					} );

				} else {

					// show the fact, image, & followup
					sendApi.sendMessage( user, script.facts[factNum].message, [
						{
							'attachment': {
								'type': 'template',
								'payload': {
									'template_type': 'generic',
									'sharable': true,
									'image_aspect_ratio': 'square',
									'elements': [
										{
											'title': 'Image',
											'image_url': script.facts[factNum].image,
											'default_action': {
												'type': 'web_url',
												'url': script.facts[factNum].image
											}
										}
									]
								}
							}
						},
						{
							'text': script.facts_reply.message,
							'quick_replies': [
								{
									'content_type': 'text',
									'title': script.facts_reply.options.continue,
									'payload': 'menu.facts'
								},
								{
									'content_type': 'text',
									'title': script.facts_reply.options.stop,
									'payload': 'switch.facts',
								}
							]
						}
					] );
				}

				break;

			/**
			 * Tag a Document section.
			 */
			case 'menu.tag' :
				catalogApi.getItem( user, payloadObj.tag_round_count, payloadObj.new_message );
				break;

			case 'tag.options.typed' :
			case 'tag.options.handwritten' :
			case 'tag.options.mixed' :
			case 'tag.options.none' :
			case 'tag.options.skip' :

				let parts = postback.payload.split( '.' );
				let choice = parts[2];

				// default reply
				let reply = {
					'message': getRand( script.tag_reply.message ),
					'option_new': getRand( script.tag_reply.option_new ),
					'option_stop': script.tag_reply.option_stop,
					'followup_new': getRand( script.tag_reply.followup_new ),
					'followup_stop': getRand( script.tag_reply.followup_stop )
				};

				if ( postback.payload !== 'tag.options.skip' ) {

					// first reply
					if ( payloadObj.tag_round_count === 1 ) {
						reply.message = script.tag_reply_first.message;
					}

					// intermission reply
					let roundLength = 5;
					if ( payloadObj.tag_round_count === roundLength ) {
						reply = Object.assign( reply, script.tag_reply_intermission );
						reply.message = reply.message.replace( 'ROUND_COUNT', roundLength );
						payloadObj.tag_round_count = 0;
					}

				}

				let quickReplies = [
					{
						'content_type': 'text',
						'title': reply.option_new,
						'payload': JSON.stringify( {
							'name': 'menu.tag',
							'type': 'JSON',
							'tag_round_count': payloadObj.tag_round_count,
							'new_message': reply.followup_new,
						} )
					},
					{
						'content_type': 'text',
						'title': reply.option_stop,
						'payload': JSON.stringify( {
							'name': 'switch.tag',
							'type': 'JSON',
							'stop_message': reply.followup_stop
						} )
					}
				];

				if ( postback.payload === 'tag.options.skip' ) {

					// when skipping, we don't need to pass a reply.message
					sendApi.sendMessage( user, {
						'text': script.tag_acknowledgment.skip,
						'quick_replies': quickReplies
					} );

				} else {

					sendApi.sendMessage( user, script.tag_acknowledgment[choice], {
						'text': reply.message,
						'quick_replies': quickReplies
					} );

				}

				break;

			//
			// default responses
			//

			default:
				sendApi.sendMessage( user, 'I didn\'t understand this response: ' + postback.payload );
				break;

		}

	}

};

/**
 * Get a random number based on the size of the given array.
 */
const getRand = ( arr ) => {
	if ( ! Array.isArray( arr ) ) {
		return arr;
	}
	let num = Math.floor( Math.random() * arr.length );
	return arr[num];
}

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
