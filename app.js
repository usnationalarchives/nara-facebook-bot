/**
 * Main file for Facebook Messenger bot.
 *
 * Load app modules and start webserver.
 */

'use strict';

// load env vars
if ( process.env.NODE_ENV !== 'production' ) {
	const dotenv = require( 'dotenv' );
	dotenv.load();
}

// load default modules
const bodyParser = require( 'body-parser' );
const express = require( 'express' );

// load route modules
const index = require( './routes/index' );
const webhook = require( './routes/webhook' );

// set up server
const app = express();
app.set( 'port', ( process.env.PORT || 3001 ) );

// add parser
app.use( bodyParser.json() );

// add routes
app.use( '/', index );
app.use( '/webhook', webhook );

// send any other request to 404
app.use( function( req, res, next ) {
	res.sendStatus( 404 );
} );

// start server
app.listen( app.get( 'port' ), () => {
	console.log( 'Webhook is listening on port ' + app.get( 'port' ) )
} );
