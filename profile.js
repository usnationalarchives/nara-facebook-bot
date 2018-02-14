/**
 * Messenger Profile settings.
 *
 * This module sends basic bot configuration like the greeting message
 * and the persistent menu to Facebook using the Messenger Profile API.
 *
 * Not loaded with the app - use `npm run-script update-profile`.
 */

'use strict';

const sendApi = require( './helpers/send' );
const script = require( './helpers/script' );
const axios = require( 'axios' );

const messengerProfileParams = {
	'access_token': process.env.PAGE_ACCESS_TOKEN,
	'greeting': [ {
		'locale': 'default',
		'text': script.greeting
	} ],
	'get_started': {
		'payload': 'get_started'
	},
	'persistent_menu': [ {
		'locale': 'default',
		'composer_input_disabled': false,
		'call_to_actions': [
			{
				'title':   script.menu.tag,
				'type':    'postback',
				'payload': 'menu.tag'
			},
			{
				'title':   script.menu.ask,
				'type':    'postback',
				'payload': 'menu.ask'
			},
			{
				'title': script.menu.submenu,
				'type':  'nested',
				'call_to_actions': [
					{
						'title':   script.menu.facts,
						'type':    'postback',
						'payload': 'menu.facts'
					},
					{
						'title':   script.menu.photos,
						'type':    'postback',
						'payload': 'menu.photos'
					},
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
													'url': script.share.link,
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
	} ]
}

axios.post( 'https://graph.facebook.com/v2.6/me/messenger_profile', messengerProfileParams )
	.then( function( res ) {
		console.log( 'Updated messenger_profile' );
	} )
	.catch( function( err ) {
		console.error( 'Unable to update messenger_profile', err );
	} );

