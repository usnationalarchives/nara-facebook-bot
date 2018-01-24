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

/**
 * Display a Forbidden error for anyone accessing the
 * root level of the webserver.
 */
router.get( '/', ( req, res ) => {
	res.sendStatus( 403 );
} );

module.exports = router;
