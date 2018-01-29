/**
 * Helper functionality to query the NARA catalog API.
 */

'use strict';

const axios = require( 'axios' );
const script = require( './script' );
const sendApi = require( './send' );

/**
 * Query NARA catalog and return an item.
 */
const getItem = ( user ) => {

	// friendly message
	sendApi.sendMessage( user, script.tag_start );
	sendApi.showTyping( user );

	// randomize result - @todo need to get 4586 dynamically
	let offset = Math.floor( Math.random() * 4586 ) + 1;

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

			let elements = [];
			let count = 0;
			let total = objects.length;

			// create elements of the object
			objects.forEach( ( object ) => {
				count++;
				elements.push( {
					'title': ( total > 1 ) ? count + ' of ' + total : result.description.item.title,
					'image_url': object.thumbnail['@url'],
					'default_action': {
						'type': 'web_url',
						'url': object.file['@url'],
						'messenger_extensions': true,
					},
					'buttons': [
						{
							'type': 'web_url',
							'url': object.file['@url'],
							'title': 'View larger size',
							'messenger_extensions': true,
						}
					]
				} );
			} );

			// send title, with follow-up catalog object and answer prompt
			sendApi.sendMessage( user, result.description.item.title + ':', [
				{
					'attachment': {
						'type': 'template',
						'payload': {
							'template_type': 'generic',
							'sharable': true,
							'image_aspect_ratio': 'square',
							'elements': elements
						}
					}
				},
				{
					'text': script.tag_prompt.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.handwritten,
							'payload': 'tag.options.handwritten'
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.typed,
							'payload': 'tag.options.typed'
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.mixed,
							'payload': 'tag.options.mixed'
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.none,
							'payload': 'tag.options.none'
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.skip,
							'payload': 'tag.options.skip'
						}
					]
				}
			] );

		} )
		.catch( function( error ) {
			console.log( error.response.data );
			sendApi.sendMessage( user, script.tag_error );
		} );

}

module.exports.getItem = getItem;
