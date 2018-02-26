/**
 * Route for media files.
 */

'use strict';

const express = require( 'express' );
const router = express.Router();

/**
 * Retrieve image info and send to an EJS template to output the image.
 */
router.get( '/:naId', ( req, res ) => {

	const naId = parseInt( req.params.naId );
	const url = decodeURIComponent( req.query.url );
	const title = decodeURIComponent( req.query.title );

	if ( naId ) {
		res.render( '../views/media.ejs', {
			naId: naId,
			url: url,
			title: title
		} );
	} else {
		res.sendStatus( 403 );
	}

} );

module.exports = router;
