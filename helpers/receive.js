'use strict';

const sendApi = require( './send' );

const receiveMessage = ( sender, message ) => {

	if ( !message.text ) {
		return;
	}

	let response = {
		'text' : 'You '
	}

};

const receivePostback = ( sender, postback ) => {

};

module.exports.receiveMessage = receiveMessage;
module.exports.receivePostback = receivePostback;
