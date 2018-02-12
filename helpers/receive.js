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

		let response;

		// default config
		let payloadObj = {
			'tag_round_count': 0,
			'new_message': script.tag_start,
			'stop_message': script.tag_stop,
		};

		// check for json in payload
		if ( postback.payload.includes( 'JSON' ) ) {

			// merge passed object into payloadObj
			payloadObj = Object.assign( payloadObj, JSON.parse( postback.payload ) );

			// set postback.payload back to a string
			postback.payload = payloadObj.name;

		}

		switch( postback.payload ) {

			case 'get_started' :
				sendApi.sendMessage( user, {
					'text': script.get_started,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.quick_menu.tag,
							'payload': 'menu.tag'
						},
						{
							'content_type': 'text',
							'title': script.quick_menu.ask,
							'payload': 'menu.ask'
						}
					]
				} );
				break;

			//
			// persistent menu
			//

			case 'menu.ask' :
				sendApi.sendMessage( user, script.ask_temp );
				break;

			//
			// photos
			//

			case 'menu.photos' :

				// get a random number
				let photoNum = Math.floor( Math.random() * script.photos.length );

				// get a photo
				catalogApi.getPhoto( user, script.photos[photoNum] );

				break;

			case 'switch.photos' :
				sendApi.sendMessage( user, {
					'text': script.photos_switch.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.photos_switch.tag,
							'payload': 'menu.tag',
						},
						{
							'content_type': 'text',
							'title': script.photos_switch.ask,
							'payload': 'menu.ask',
						},
						{
							'content_type': 'text',
							'title': script.photos_switch.facts,
							'payload': 'menu.facts',
						}
					]
				} );
				break;

			//
			// fun facts
			//

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
								}
							]
						}
					] );
				}

				break;

			case 'switch.facts':
				sendApi.sendMessage( user, {
					'text': script.facts_switch.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.facts_switch.tag,
							'payload': 'menu.tag',
						},
						{
							'content_type': 'text',
							'title': script.facts_switch.ask,
							'payload': 'menu.ask',
						},
						{
							'content_type': 'text',
							'title': script.facts_switch.photos,
							'payload': 'menu.photos',
						}
					]
				} );
				break;

			//
			// image tagging
			//

			case 'menu.tag' :
				catalogApi.getItem( user, payloadObj.tag_round_count, payloadObj.new_message );
				break;

			case 'tag.options.typed' :
			case 'tag.options.handwritten' :
			case 'tag.options.mixed' :
			case 'tag.options.none' :

				let parts = postback.payload.split( '.' );
				let choice = parts[2];

				let roundLength = 5;

				let replyObj;

				if ( payloadObj.tag_round_count === 1 ) {

					replyObj = script.tag_reply_first;

				} else if ( payloadObj.tag_round_count === roundLength ) {

					replyObj = script.tag_intermission;

					// insert in the correct round length
					replyObj.message = replyObj.message.replace( 'ROUND_COUNT', roundLength );

					// reset tag count
					payloadObj.tag_round_count = 0;

				} else {

					// get a random number based on number of reply options
					let replyNum = Math.floor( Math.random() * script.tag_reply.length );

					replyObj = script.tag_reply[replyNum];

				}

				sendApi.sendMessage( user, script.tag_acknowledgment[choice], {
					'text': replyObj.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': replyObj.options.new,
							'payload': JSON.stringify( {
								'name': 'menu.tag',
								'type': 'JSON',
								'tag_round_count': payloadObj.tag_round_count,
								'new_message': replyObj.followup.new,
							} )
						},
						{
							'content_type': 'text',
							'title': replyObj.options.stop,
							'payload': JSON.stringify( {
								'name': 'tag.stop',
								'type': 'JSON',
								'stop_message': replyObj.followup.stop
							} )
						}
					]
				} );

				break;

			// when skipping, we don't need to check tag count or pass along custom messages
			case 'tag.options.skip' :
				sendApi.sendMessage( user, {
					'text': script.tag_acknowledgment.skip,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': payloadObj.new_message,
							'payload': JSON.stringify( {
								'name': 'menu.tag',
								'type': 'JSON',
								'tag_round_count': payloadObj.tag_round_count
							} )
						},
						{
							'content_type': 'text',
							'title': payloadObj.stop_message,
							'payload': 'tag.stop'
						}
					]
				} );
				break;

			case 'tag.stop' :
				sendApi.sendMessage( user, {
					'text': payloadObj.stop_message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.stop_prompts.facts,
							'payload': 'menu.facts'
						},
						{
							'content_type': 'text',
							'title': script.stop_prompts.ask,
							'payload': 'menu.ask'
						},
						{
							'content_type': 'text',
							'title': script.stop_prompts.photos,
							'payload': 'menu.photos'
						}
					]
				} );
				break;

			//
			// default responses
			//

			default:

				//
				// check for conditional payload
				//

				let payloadParts = postback.payload.split( '.' );

				// joke replies
				if ( payloadParts[0] === 'joke_replies' ) {
					let jokeNum = payloadParts[1];
					let replyKey = payloadParts[2];
					let answer = '';

					if ( script.jokes[jokeNum][replyKey] ) {
						answer = script.jokes[jokeNum][replyKey];
					} else {
						answer = script.jokes[jokeNum].a;
					}

					// send punchline and followup
					sendApi.sendMessage( user, answer, {
						'text': script.jokes_reply.message,
						'quick_replies': [
							{
								'content_type': 'text',
								'title': script.jokes_reply.options.continue,
								'payload': 'menu.jokes'
							}
						]
					} );

				//
				// if no conditionals discovered, return basic response
				//

				} else {
					sendApi.sendMessage( user, 'I didn\'t understand this response: ' + postback.payload );
				}

				break;

		}

	}

};

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
