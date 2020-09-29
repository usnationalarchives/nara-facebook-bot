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
	let offset = Math.floor( Math.random() * 2065 ) + 1;
  /*
	let url = 'https://catalog.archives.gov/api/v1'
			+ '?resultTypes=item'
			// textual records
			+ '&description.item.generalRecordsTypeArray.generalRecordsType.naId=10035676'
			// ...with jpegs
			+ '&objects.object.technicalMetadata.mime_is=image/jpeg'
			// ...without pdfs
			// + '&objects.object.technicalMetadata.mime_not=application/pdf'
			+ '&rows=1'
			+ '&q=speeches'
			+ '&offset=' + offset;
    */
	// testable url:
	// https://catalog.archives.gov/api/v1?resultTypes=item&objects.object.technicalMetadata.mime_is=image/jpeg&objects.object.technicalMetadata.mime_not=application/pdf&rows=1&description.item.generalRecordsTypeArray.generalRecordsType.naId=10035676&offset=1&q=speeches
  let url='https://catalog.archives.gov/api/v1?resultTypes=object&description.item.generalRecordsTypeArray.generalRecordsType.naId=10035676' +
          '&objects.object.technicalMetadata.mime_is=image/jpeg&rows=1&q=speeches' +
          '&offset=' + offset +
          '&objects.object.publicContributions.tags.tag_not=ChatbotTag';
  console.log('************ API URL ********************');
  console.log(url);
  axios.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36";
	axios.get( url )
		.then( function( res ) {
			//console.log( 'Request response', res );

			let result = res.data.opaResponse.results.result[0];
			let objects = result.objects.object;


			// ensure objects is an array
			if ( ! Array.isArray( objects ) ) {
				objects = [ objects ];
			}

			// remove non-jpegs
			for ( let i = 0; i < objects.length; i++ ) {
				if ( objects[i].file['@mime'] !== 'image/jpeg' ) {
					objects.splice( i, 1 );
				}
			}

			if ( !objects.length ) {
				console.error( 'Objects array is empty' );
			}

			// choose an array item at random
			let objNum = Math.floor( Math.random() * objects.length );
			let thisObject = objects[objNum];



      console.log('3 naId ******************************************');
			//let naId = result.description.item.naId;
      let naId = result.parentDescriptionNaId;
      console.log(naId);
      console.log('4 url ******************************************');
      console.log(thisObject.file['@url']);
      console.log('5 object id ***************************');
      console.log(thisObject['@id']);
      console.log('******************************************');

			let newTagRoundCount = tagRoundCount + 1;

			// send title, with follow-up catalog object and answer prompt
			sendApi.sendMessage( user,
				{
					'attachment': {
						'type': 'template',
						'payload': {
							'template_type': 'generic',
							'sharable': true,
							'image_aspect_ratio': 'square',
							'elements': [
								{
									'title': 'naId ' + naId,
									'image_url': thisObject.file['@url'],
									'default_action': {
										'type': 'web_url',
										'url': process.env.URL + 'media/' + naId + '/?title=' + encodeURIComponent( 'naid'+naId ) + '&url=' + encodeURIComponent( thisObject.file['@url'] ),
										'webview_height_ratio': 'tall',
										'messenger_extensions': true
									},
									'buttons': [
										{
											'type': 'web_url',
											'title': script.tag_image_options.big,
											'url': process.env.URL + 'media/' + naId + '/?title=' + encodeURIComponent( 'naid'+naId ) + '&url=' + encodeURIComponent( thisObject.file['@url'] ),
											'webview_height_ratio': 'tall',
											'messenger_extensions': true
										},
										{
											'type': 'web_url',
											'url': 'https://catalog.archives.gov/id/' + naId,
											'title': script.tag_image_options.learn,
											'webview_height_ratio': 'tall',
											'messenger_extensions': true
										},
										{
											'type': 'element_share'
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
								'naId':naId,
								'objectId':thisObject['@id']
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.typed,
							'payload': JSON.stringify( {
								'name': 'tag.options.typed',
								'type': 'JSON',
								'tag_round_count': newTagRoundCount,
								'naId':naId,
								'objectId':thisObject['@id']
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.mixed,
							'payload': JSON.stringify( {
								'name': 'tag.options.mixed',
								'type': 'JSON',
								'tag_round_count': newTagRoundCount,
								'naId':naId,
								'objectId':thisObject['@id']
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.none,
							'payload': JSON.stringify( {
								'name': 'tag.options.none',
								'type': 'JSON',
								'tag_round_count': newTagRoundCount,
								'naId':naId,
								'objectId':thisObject['@id']
							} )
						},
						{
							'content_type': 'text',
							'title': script.tag_prompt.options.skip,
							'payload': JSON.stringify( {
								'name': 'tag.options.skip',
								'type': 'JSON',
								'tag_round_count': tagRoundCount, // don't increment skipped items
								'naId':naId,
								'objectId':thisObject['@id']
							} )
						}
					]
				}
			);

		} )
		.catch( function( error ) {
			//console.log( 'Request error', error.response.data );
      console.log( 'Request error', error);
			sendApi.sendMessage( user, script.tag_error );
		} );

}

/**
 * Query NARA catalog and return an interesting photo.
 */
const getPhoto = ( user, naId, history ) => {

	// friendly message
	sendApi.sendMessage( user, script.get_photo, true );

	let url = 'https://catalog.archives.gov/api/v1?naIds=' + naId;

	axios.get( url )
		.then( function( res ) {
			//console.log( 'Request response', res );

			let result = res.data.opaResponse.results.result[0];
			let objects = result.objects.object;

			// ensure objects is an array
			if ( ! Array.isArray( objects ) ) {
				objects = [ objects ];
			}

			let thisObject = objects[0];

			// send title, with follow-up catalog object and answer prompt
			sendApi.sendMessage( user, result.description.item.title, [
				{
					'attachment': {
						'type': 'template',
						'payload': {
							'template_type': 'generic',
							'sharable': true,
							'image_aspect_ratio': 'square',
							'elements': [
								{
									'title': 'Click image to view larger size',
									'image_url': thisObject.file['@url'],
									'default_action': {
										'type': 'web_url',
										'url': process.env.URL + 'media/' + result.naId + '/?title=' + encodeURIComponent( result.description.item.title ) + '&url=' + encodeURIComponent( thisObject.file['@url'] ),
										'webview_height_ratio': 'tall',
										'messenger_extensions': true
									},
									'buttons': [
										{
											'type': 'web_url',
											'url': process.env.URL + 'media/' + result.naId + '/?title=' + encodeURIComponent( result.description.item.title ) + '&url=' + encodeURIComponent( thisObject.file['@url'] ),
											'title': script.tag_image_options.big,
											'webview_height_ratio': 'tall',
											'messenger_extensions': true
										},
										{
											'type': 'web_url',
											'url': 'https://catalog.archives.gov/id/' + naId,
											'title': script.tag_image_options.learn,
											'webview_height_ratio': 'tall',
											'messenger_extensions': true
										},
										{
											'type': 'element_share'
										}
									]
								}
							]
						}
					}
				},
				{
					'text': script.photos_reply.message,
					'quick_replies': [
						{
							'content_type': 'text',
							'title': script.photos_reply.options.continue,
							'payload': JSON.stringify( {
								'name': 'menu.photos',
								'type': 'JSON',
								'history': history
							} )
						},
						{
							'content_type': 'text',
							'title': script.photos_reply.options.stop,
							'payload': 'switch.photos'
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
module.exports.getPhoto = getPhoto;
