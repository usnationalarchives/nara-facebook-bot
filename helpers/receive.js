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

		switch( postback.payload ) {

			case 'get_started' :
				sendApi.sendMessage( user, script.get_started );
				break;

			//
			// persistent menu
			//

			case 'menu.ask' :
				// question categories
				// (drilling down to more question categories)
				break;

			case 'menu.photos' :
				// just show a photo + facts
				// prompt to continue
				break;

			//
			// jokes
			//

			case 'menu.jokes' :

				// get a random number
				let jokeNum = Math.floor( Math.random() * 3 );

				// build quick_replies
				let jokeReplies = [];
				for ( var replyKey in script.jokes[jokeNum].options ) {
					if ( !script.jokes[jokeNum].options.hasOwnProperty( replyKey ) ) {
						continue;
					}

					/* jokeReplies.push({
						'content_type': 'text',
						'title': script.jokes[jokeNum].options[replyKey],
						'payload': 'joke_replies.' + jokeNum + '.' + replyKey
					} ); */

					jokeReplies.push({
						'title': script.jokes[jokeNum].options[replyKey],
						'subtitle': 'Click to select',
						'default_action': {
							'type': 'postback',
							'title': 'Click to select',
							'messenger_extensions': true,
							'payload': 'joke_replies.' + jokeNum + '.' + replyKey
						}
					} );

				}

				// show the joke & responses
				/* sendApi.sendMessage( user, {
					'text': script.jokes[jokeNum].q,
					'quick_replies': jokeReplies
				} ); */

				sendApi.sendMessage( user, {
					'attachment': {
						'type': 'template',
						'payload': {
							'template_type': 'list',
							'top_element_style': 'compact',
							'elements': jokeReplies
						}
					}

				} );

				break;

			//
			// fun facts
			//

			case 'menu.facts' :

				// get a random number
				let factNum = Math.floor( Math.random() * 5 );

				// show the fact & followup
				sendApi.sendMessage( user, script.facts[factNum], {
					'text': script.facts_reply.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.facts_reply.options.continue,
							'payload': 'menu.facts'
						}
					]
				} );

				break;

			//
			// image tagging
			//

			case 'menu.tag' :
				catalogApi.getItem( user );
				break;

			case 'tag.options.typed' :
			case 'tag.options.handwritten' :
			case 'tag.options.mixed' :
			case 'tag.options.none' :
			case 'tag.options.skip' :

				let parts = postback.payload.split( '.' );
				let choice = parts[2];

				// get a random number
				let replyNum = Math.floor( Math.random() * 3 );

				sendApi.sendMessage( user, {
					'text': script.tag_reply[replyNum].message[choice],
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.tag_reply[replyNum].options.learn,
							'payload': 'tag.learn'
						},
						{
							'content_type': 'text',
							'title': script.tag_reply[replyNum].options.new,
							'payload': 'menu.tag'
						},
						{
							'content_type': 'text',
							'title': script.tag_reply[replyNum].options.stop,
							'payload': 'tag.stop'
						}
					]
				} );

				break;

			case 'tag.learn' :
				// @todo
				sendApi.sendMessage( user, 'Learn more placeholder', {
					'text': script.tag_learn_reply.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.tag_learn_reply.options.new,
							'payload': 'menu.tag'
						},
						{
							'content_type': 'text',
							'title': script.tag_learn_reply.options.stop,
							'payload': 'tag.stop'
						}
					]
				} );
				break;

			case 'tag.stop' :
				sendApi.sendMessage( user, script.tag_stop );
				break;

			// default

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
