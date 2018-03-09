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
 *
 * Database: usertags
 *    "uuid": "",             // auto-generated dynamodb primary key
 *    "timestamp": "",        // current date / time
 *    "userid": "",           // if available, ex. from Facebook
 *    "objectid": "",         // NARA API Object id
 *    "ipaddress": "",        // user's IP address for fraud detection, if available
 *    "score": "",            // an integer representing scores
 *
 */
const storeTag = (user, payload ) => {

	console.log(payload);
	console.log(user);

	// get current timestamp
	var moment = require('moment')
	var timestamp = moment().format();

	// get user score
	let parts = payload.name.split( '.' );
	let choice = parts[2];

	// get naID
	var naid = payload.naId;

	// get objectID
	var objectid = payload.objectid;

	// get user ip address	
	var ipaddress = "127.0.0.1";    

	// get uuid
	var uniqid = require('uniqid');
	var uuid = uniqid();
	
	// get userid
	var userid = "greg schnippel";

	var params = {
        	TableName: "usertags",
	        Item: {
				"uuid":  uuid,
				"timestamp": timestamp,
				"userid": userid,
				"naid": naid,
				"objectid": objectid,
				"ipaddress": ipaddress,
				"score": choice,
        	}
	};

	console.log(params);

	// setup aws connection
	var AWS = require("aws-sdk");

	AWS.config.update({
		region: "us-east-2",
		endpoint: "http://dynamodb.us-east-2.amazonaws.com"
	});
	
	var docClient = new AWS.DynamoDB.DocumentClient({
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY
	});

	// write it all to Dynamo and out.. 
	
	docClient.put(params, function(err, data) {
	if (err) {
           console.error("Unable to add user tag. Error JSON:", JSON.stringify(err,null,2));
       } else {
           console.log("PutItem user tag succeeded:");
       }
    });

};

/**
 * Receive a text message, interpret it, and return a response.
 */
const receiveMessage = ( user, message ) => {

	if ( message.text ) {

		// clean up message
		message.text = message.text.trim();
		message.text = message.text.toLowerCase();
		message.text = message.text.replace( /[^\w\s]/g, '' ); // remove punctuation

		switch( message.text ) {

			case 'hi' :
			case 'hello' :
			case 'start' :
			case 'restart' :
			case 'begin' :
				sendStart( user );
				break;

			case 'help' :
			case 'info' :
				sendApi.sendMessage( user, script.help );
				break;

			case 'end' :
			case 'stop' :
			case 'exit' :
			case 'quit' :
			case 'q' :
				sendStop( user );
				break;

			default :
				sendDefault( user );
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

		const payload = setUpPayload( postback.payload );

		switch( payload.name ) {

			// welcome message & options
			case 'get_started' :
				sendStart( user );
				break;

			// stop the bot
			case 'stop' :
				sendStop( user );
				break;

			// after user says they want to exit current section
			case 'switch.tag' :
			case 'switch.photos' :
			case 'switch.facts' :
			case 'switch.ask' :
				sendSwitchPrompt( user, payload );
				break;

			// start Ask a Question
			case 'menu.ask' :
				sendAsk( user, payload );
				break;

			// start interesting photos
			case 'menu.photos' :
				let photo = getRandSmart( script.photos, payload.history );
				catalogApi.getPhoto( user, photo, payload.history );
				break;

			// start fun facts
			case 'menu.facts' :
				sendFact( user, payload );
				break;

			// start tagging
			case 'menu.tag' :
				catalogApi.getItem( user, payload.tag_round_count, payload.new_message );
				break;

			// after user tags an image
			case 'tag.options.typed' :
			case 'tag.options.handwritten' :
			case 'tag.options.mixed' :
			case 'tag.options.none' :
			case 'tag.options.skip' :
				sendTagResponse( user, payload );
				break;

			// this shouldn't happen
			default:
				sendDefault( user );
				break;

		}

	}

};

/**
 * Convert payload from string or JSON string to object
 * with default args.
 */
const setUpPayload = ( payload ) => {

	let args = {};

	// if payload is JSON string, parse; otherwise set name
	if ( payload.includes( 'JSON' ) ) {
		args = JSON.parse( payload );
	} else {
		args.name = payload;
	}

	// merge parsed object into default args
	return Object.assign( {
		'tag_round_count': 0,
		'new_message': script.tag_start,
		'stop_message': script.switch_section,
		'history': [],
		'category_path': []
	}, args );

}

/**
 * Send default messages.
 */
const sendDefault = ( user ) => {
	let response = getRand( script.default );
	if ( response.link_url ) {
		sendApi.sendMessage( user, {
			'attachment': {
				'type': 'template',
				'payload': {
					'template_type': 'button',
					'text': response.message,
					'buttons': [
						{
							'type': 'web_url',
							'url': response.link_url,
							'title': response.link_text,
							'webview_height_ratio': 'tall',
							'messenger_extensions': true
						}
					]
				}
			}
		} );
	} else {
		sendApi.sendMessage( user, response );
	}
}

/**
 * Send start messages.
 */
const sendStart = ( user ) => {
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
}

/**
 * Send stop messages.
 */
const sendStop = ( user ) => {

	let stop = getRand( script.stop );
	let message = {
		'attachment': {
			'type': 'template',
			'payload': {}
		}
	};

	// ...share links are complicated
	if ( stop.share ) {
		sendApi.sendMessage( user, {
			'attachment': {
				'type': 'template',
				'payload': {
					'template_type': 'generic',
					'elements': [
						{
							'title': stop.message,
							'buttons': [
								{
									'type': 'element_share',
									'share_contents': {
										'attachment': {
											'type': 'template',
											'payload': {
												'template_type': 'generic',
												'elements': [
													{
														'title': script.share.message,
														'buttons': [
															{
																'type': 'web_url',
																'url': script.share.link_url,
																'title': script.share.link_text
															}
														]
													}
												]
											}
										}
									}
								}
							]
						}
					]
				}
			}
		} );
	} else if ( stop.link_url ) {
		sendApi.sendMessage( user, {
			'attachment': {
				'type': 'template',
				'payload': {
					'template_type': 'button',
					'text': stop.message,
					'buttons': [
						{
							'type': 'web_url',
							'url': stop.link_url,
							'title': stop.link_text,
							'webview_height_ratio': 'tall',
							'messenger_extensions': true
						}
					]
				}
			}
		}, script.stop_hint );
	} else {
		sendApi.sendMessage( user, stop, script.stop_hint );
	}

}

/**
 * Display quick replies to switch sections or quit.
 */
const sendSwitchPrompt = ( user, payload ) => {

	let parts = payload.name.split( '.' );
	let section = parts[1];
	let sections = [ 'tag', 'photos', 'facts', 'ask' ];
	let quickReplies = [];

	// display different sections
	for( let i = 0; i < 4; i++ ) {
		if ( section !== sections[i] ) {
			quickReplies.push( {
				'content_type': 'text',
				'title': script.menu[sections[i]],
				'payload': 'menu.' + sections[i]
			} );
		}
	}

	// stop option
	quickReplies.push( {
		'content_type': 'text',
		'title': script.menu.stop,
		'payload': 'stop'
	} );

	// when switching away from tagging, display more info
	if ( payload.name === 'switch.tag' && payload.stop_message !== script.switch_section ) {

		// send a custom message before the switch_section prompt
		sendApi.sendMessage( user, {
			'attachment': {
				'type': 'template',
				'payload': {
					'template_type': 'button',
					'text': payload.stop_message.message,
					'buttons': [
						{
							'type': 'web_url',
							'url': payload.stop_message.link_url,
							'title': payload.stop_message.link_text
						}
					]
				}
			}
		}, {
			'text': script.switch_section,
			'quick_replies': quickReplies
		} );

	} else {

		sendApi.sendMessage( user, {
			'text': payload.stop_message,
			'quick_replies': quickReplies
		} );

	}
}

/**
 * Ask a Question section.
 */
const sendAsk = ( user, payload ) => {

	let category = script.ask;
	let i = 0;

	// drill down until you get the correct category object
	if ( payload.category_path.length ) {
		for( i = 0; i < payload.category_path.length; i++ ) {
			category = category.categories[payload.category_path[i]];
		}
	}

	let quickReplies = [];
	let newPath = [];

	if ( category.categories ) {

		// build quick replies from categories
		for ( i = 0; i < category.categories.length; i++ ) {

			newPath = payload.category_path.slice();
			newPath.push( i );

			quickReplies.push( {
				'content_type': 'text',
				'title': category.categories[i].category,
				'payload': JSON.stringify( {
					'name': 'menu.ask',
					'type': 'JSON',
					'category_path': newPath
				} )
			} );

		}

	}

	// build back button
	if ( payload.category_path.length ) {

		newPath = payload.category_path.slice();
		newPath.pop();

		quickReplies.push( {
			'content_type': 'text',
			'title': script.ask.back_text,
			'payload': JSON.stringify( {
				'name': 'menu.ask',
				'type': 'JSON',
				'category_path': newPath
			} )
		} );

	} else {

		quickReplies.push( {
			'content_type': 'text',
			'title': script.ask.back_text,
			'payload': 'switch.ask'
		} );

	}

	sendApi.sendMessage( user, {
		'text': category.message,
		'quick_replies': quickReplies
	} );

}

/**
 * Send a random fact and followup options.
 */
const sendFact = ( user, payload ) => {

	// choose a fact
	let fact = getRandSmart( script.facts, payload.history );

	// canned message & replies
	let followupMessage = {
		'text': script.facts_reply.message,
		'quick_replies': [
			{
				'content_type': 'text',
				'title': script.facts_reply.options.continue,
				'payload': JSON.stringify( {
					'name': 'menu.facts',
					'type': 'JSON',
					'history': payload.history
				} )
			},
			{
				'content_type': 'text',
				'title': script.facts_reply.options.stop,
				'payload': 'switch.facts',
			}
		]
	}

	// is string?
	if ( typeof fact === 'string' || fact instanceof String ) {

		// show the fact & followup
		sendApi.sendMessage( user, fact, followupMessage );

	// includes image?
	} else {

		// show the fact, image, & followup
		sendApi.sendMessage( user, fact.message, [
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
								'image_url': fact.image,
								'default_action': {
									'type': 'web_url',
									'url': fact.image
								}
							}
						]
					}
				}
			},
			followupMessage
		] );

	}

}

/**
 * Send tag responses.
 */
const sendTagResponse = ( user, payload ) => {

	let parts = payload.name.split( '.' );
	let choice = parts[2];

	storeTag(user, payload);

	// default reply
	let reply = {
		'message': getRand( script.tag_reply.message ),
		'option_new': getRand( script.tag_reply.option_new ),
		'option_stop': script.tag_reply.option_stop,
		'followup_new': getRand( script.tag_reply.followup_new ),
		'followup_stop': getRand( script.tag_reply.followup_stop )
	};

	if ( payload.name !== 'tag.options.skip' ) {

		// first reply
		if ( payload.tag_round_count === 1 ) {
			reply.message = script.tag_reply_first.message;
		}

		// intermission reply
		if ( payload.tag_round_count === script.tag_round_length ) {
			reply = Object.assign( reply, script.tag_reply_intermission );
			payload.tag_round_count = 0;
		}

	}

	let quickReplies = [
		{
			'content_type': 'text',
			'title': reply.option_new,
			'payload': JSON.stringify( {
				'name': 'menu.tag',
				'type': 'JSON',
				'tag_round_count': payload.tag_round_count,
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

	if ( payload.name === 'tag.options.skip' ) {

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

}

/**
 * Get a random array item.
 */
const getRand = ( arr ) => {
	if ( ! Array.isArray( arr ) ) {
		return arr;
	}
	let index = Math.floor( Math.random() * arr.length );
	return arr[index];
}

/**
 * Get a random array item, while ensuring the item hasn't been used recently.
 */
const getRandSmart = ( arr, history ) => {

	let tempArr = arr.slice();
	let index;

	// remove indexes recorded in history from tempArr
	if ( history.length ) {
		tempArr = arr.filter( function( value, key ) {
			return history.indexOf( key ) === -1;
		} );
	}

	if ( tempArr.length ) {

		// get a random item in tempArr
		let tempIndex = Math.floor( Math.random() * tempArr.length );

		// get the original index in arr
		index = arr.findIndex( function( element ) {
			return element === tempArr[tempIndex];
		} );

		history.push( index ); // updates payload object

	} else {

		// if there's no temps left, return the first item in history
		index = history[0];
		history.splice( 0, history.length, index ); // updates payload object

	}

	return arr[index];

}

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
