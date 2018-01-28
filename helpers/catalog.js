/**
 * Helper functionality to query the NARA catalog API.
 */

'use strict';

const axios = require( 'axios' );
const sendApi = require( './send' );

/**
 * Query NARA catalog and return an item.
 */
const getItem = ( user ) => {

	// friendly message
	sendApi.sendMessage( user, script.loop_load );
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

			sendApi.sendMessage( user, result.description.item.title + ':' );

			let elements = [];
			let count = 0;
			let total = objects.length;

			objects.forEach( ( object ) => {
				count++;
				elements.push( {
					'title': ( total > 1 ) ? count + ' of ' + total : result.description.item.title,
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
						'sharable': true,
						'image_aspect_ratio': 'square',
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

module.exports.getItem = getItem;
