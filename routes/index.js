/**
 * Route for server index.
 *
 * (This is not strictly necessary but was helpful as a learning aid.)
 */

'use strict';

const express = require( 'express' );
const router = express.Router();

/**
 * Display a Forbidden error for anyone accessing the root level of
 * the webserver.
 */
router.get( '/', ( req, res ) => {
	res.sendStatus( 403 );
} );

module.exports = router;
