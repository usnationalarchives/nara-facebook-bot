/**
 * Route for server index.
 *
 * This is not strictly necessary -- all it does is
 * return 403 Forbidden -- but it can be helpful as a
 * learning aid or sandbox.
 */

'use strict';

const express = require( 'express' );
const router = express.Router();
const axios = require( 'axios' );
const sendApi = require( '../helpers/send' );

/**
 * Display a Forbidden error for anyone accessing the
 * root level of the webserver.
 */
router.get( '/', ( req, routerResponse ) => {

	/*
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

			// sendApi.sendMessage( user, result.description.item.title + ':' );

			let elements = [];

			// standardize objects
			if ( ! Array.isArray( objects ) ) {
				objects = [ objects ];
			}

			objects.forEach( ( object ) => {
				elements.push( {
					'image_url': object.thumbnail['@path'],
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

			// sendApi.sendMessage( user, response, loopChoices() );

		} )
		.catch( function( error ) {
			console.log( error.response.data );
			// @todo send error message to user?
		} );

	*/

	res.sendStatus( 403 );

} );

module.exports = router;
