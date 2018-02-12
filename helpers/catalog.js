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
const getItem = ( user, tagRoundCount = 0, startMessage = '' ) => {

	// friendly message
	if ( ! startMessage ) {
		startMessage = script.tag_start;
	}
	sendApi.sendMessage( user, startMessage, true );

	// randomize result - @todo need to get total dynamically
	let offset = Math.floor( Math.random() * 170 ) + 1;

	let url = 'https://catalog.archives.gov/api/v1'
			+ '?resultTypes=item'
			// textual records
			+ '&description.item.generalRecordsTypeArray.generalRecordsType.naId=10035676'
			// ...with jpegs
			+ '&objects.object.technicalMetadata.mime_is=image/jpeg'
			// ...without pdfs
			+ '&objects.object.technicalMetadata.mime_not=application/pdf'
			+ '&rows=1'
			+ '&q=speeches'
			+ '&offset=' + offset;

	// testable url:
	// https://catalog.archives.gov/api/v1?resultTypes=item&objects.object.technicalMetadata.mime_is=image/jpeg&objects.object.technicalMetadata.mime_not=application/pdf&rows=1&description.item.generalRecordsTypeArray.generalRecordsType.naId=10035676&offset=1&q=speeches

	axios.get( url )
		.then( function( res ) {
			console.log( 'Request response', res );

			let result = res.data.opaResponse.results.result[0];
			let objects = result.objects.object;

			// ensure objects is an array
			if ( ! Array.isArray( objects ) ) {
				objects = [ objects ];
			}

			// choose an array item at random
			let objNum = Math.floor( Math.random() * objects.length );
			let thisObject = objects[objNum];

			let naId = result.description.item.naId;

			let newTagRoundCount = tagRoundCount + 1;

			// send title, with follow-up catalog object and answer prompt
			sendApi.sendMessage( user, result.description.item.title + ':', [
				{
					'attachment': {
						'type': 'template',
						'payload': {
							'template_type': 'generic',
							'sharable': true,
							'image_aspect_ratio': 'square',
							'elements': [
								{
									'title': result.description.item.title,
									'image_url': thisObject.file['@url'],
									'default_action': {
										'type': 'web_url',
										'url': thisObject.file['@url']
									},
									'buttons': [
										{
											'type': 'web_url',
											'url': thisObject.file['@url'],
											'title': script.tag_image_options.big,
										},
										{
											'type': 'web_url',
											'url': 'https://catalog.archives.gov/id/' + naId,
											'title': script.tag_image_options.learn,
											'webview_height_ratio': 'tall',
											'messenger_extensions': true
										}
									]
								}
							]
						}
					}
				},
				{
					'text': script.tag_prompt.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.handwritten,
							'payload': JSON.stringify( {
								'name': 'tag.options.handwritten',
								'type': 'JSON',
								'tag_round_count': newTagRoundCount,
								'naId':naId
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.typed,
							'payload': JSON.stringify( {
								'name': 'tag.options.typed',
								'type': 'JSON',
								'tag_round_count': newTagRoundCount,
								'naId':naId
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.mixed,
							'payload': JSON.stringify( {
								'name': 'tag.options.mixed',
								'type': 'JSON',
								'tag_round_count': newTagRoundCount,
								'naId':naId
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.none,
							'payload': JSON.stringify( {
								'name': 'tag.options.none',
								'type': 'JSON',
								'tag_round_count': newTagRoundCount,
								'naId':naId
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.skip,
							'payload': JSON.stringify( {
								'name': 'tag.options.skip',
								'type': 'JSON',
								'tag_round_count': tagRoundCount, // don't increment skipped items
								'naId':naId
							} )
						}
					]
				}
			] );

		} )
		.catch( function( error ) {
			console.log( 'Request error', error.response.data );
			sendApi.sendMessage( user, script.tag_error );
		} );

}

module.exports.getItem = getItem;
