/**
 * Route for server index.
 *
 * (This is not strictly necessary but was helpful as a learning aid.)
 */

'use strict';

const express = require( 'express' );
const router = express.Router();
const axios = require( 'axios' );

/**
 * Display a Forbidden error for anyone accessing the root level of
 * the webserver.
 */
router.get( '/', ( req, res ) => {

	let url = 'https://catalog.archives.gov/api/v1/';
	let args = '?q=speeches&f.level=item&f.materialsType=text&tabType=online&rows=1';

	axios.get( url + args )
		.then( function( res ) {
			console.log( res );
		} )
		.catch( function( error ) {
			console.log( error );
		} );

	/* let options = {
		host:'https://catalog.archives.gov',
		port:80,
		path:'',
		method:'POST'
	};

	http.request( options, function( res ) {
		console.log( 'STATUS: ' + res.statusCode );
		console.log( 'HEADERS: ' + JSON.stringify( res.headers ) );

		res.setEncoding( 'utf8' );
		res.on( 'data', function( chunk ) {
			console.log( 'BODY: ' + chunk );
		} );
	} );

	res.send( '<p>Hello, world!</p>' ); */

	// res.sendStatus( 403 );
} );

module.exports = router;
