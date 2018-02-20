/**
 * The textual script used by the bot to interact with users.
 */

'use strict';

const script = {
	//
	// General
	//
	'default': [
		{
			'message': 'Sorry, I didn\'t understand that. Have you tried asking your question on the History Hub? This site is designed to assist researchers:',
			'link_url': 'https://history.gov/welcome',
			'link_text': 'history.gov'
		},
		'I see what you\'re getting at, but no, you still cannot touch the Declaration of Independence.',
		'I didn\'t quite catch that, type "help" or try the menu below.',
		'Sorry, I didn\'t understand that. For more info, type "help". You can also try the menu below for more options.'
	],
	'greeting': 'Hello {{user_first_name}}! Hit the "Get Started" button below.',
	'get_started': 'Want to help make history accessible? Tag the type of writing you see in our documents. You can also ask questions about the National Archives.',
	'menu': {
		'tag': 'Tag a document',
		'facts': 'Fun facts',
		'ask': 'Ask a question',
		'photos': 'Interesting photos',
		'submenu': 'More fun stuff',
		'stop': 'Stop'
	},
	'help': 'You\'re talking to the National Archives Facebook page. Here you can help make history accessible by tagging the type of writing you see in our documents. You can also ask questions about the National Archives, see interesting photos, or find out more fun facts. Tap an option in the menu below to continue, or type "start".',
	'switch_section': 'Would you like to do something else?',
	'ask_temp': 'Ask a question section placeholder.',
	'share': {
		'message': 'National Archives - Citizen Archivist Project',
		'link_url': 'http://m.me/ChiefMessengerLab',
		'link_text': 'Try it out'
	},
	'stop': [
		{
			'message': 'Want to receive our twice-monthly newsletter? Sign up here:',
			'link_url': 'https://www.archives.gov/research/catalog/newsletter',
			'link_text': 'Newsletter'
		},
		{
			'message': 'Leaving us already? Join us again soon! Visit the National Archives Catalog to find more images:',
			'link_url': 'https://catalog.archives.gov/',
			'link_text': 'Catalog'
		},
		{
			'message': 'Had a good time? Share with a friend!',
			'share': true, // need this to display share prompt
		},
	],
	'stop_hint': 'If you\'d like to start again, type "start" or select an option from the menu anytime.',
	//
	// Tag a Document
	//
	'tag_start': 'Let\'s go! I\'m retrieving a document from the virtual stacks...',
	'tag_error': 'Something went wrong. Open the menu to try again or choose another option.',
	'tag_image_options': {
		'big': 'View larger size',
		'learn': 'Learn more'
	},
	'tag_prompt': {
		'message': 'Tag it! Select what kind of writing you see in the document.',
		'options': {
			'handwritten': 'Handwritten',
			'typed': 'Typed',
			'mixed': 'Both',
			'none': 'No writing',
			'skip': 'No idea'
		}
	},
	'tag_acknowledgment': {
		'handwritten': 'Tagged as handwritten.',
		'typed': 'Tagged as typed.',
		'mixed': 'Tagged as containing typed and handwritten text.',
		'none': 'Tagged as containing no writing.',
		'skip': 'No problem! Skipping this one.'
	},
	'tag_reply': {
		'message':[
			'Good eye! Isn\'t this fun? Want to tag another?',
			'You\'re on a roll! Only 38,999,999 more to go. (Just kidding!) Want to tag some more?',
		],
		'option_new':[
			'Tag another document',
			'Let\'s keep moving',
		],
		'option_stop': 'Stop tagging',
		'followup_new':[
			'You got it! Heading back to the virtual stacks to retrieve the next document...',
			'You got it! Let me find you a good one...',
			'Grabbing another document for you...'
		],
		'followup_stop':[
			{
				'message': 'That was fun! FYI, our citizen archivist program invites you to tag and transcribe more documents.',
				'link_url': 'https://www.archives.gov/citizen-archivist',
				'link_text': 'Find out more'
			},
			{
				'message': 'Every bit counts! FYI, our citizen archivist program invites you to tag and transcribe more documents.',
				'link_url': 'https://www.archives.gov/citizen-archivist',
				'link_text': 'Find out more'
			},
			{
				'message': 'Want to get more involved? Continue your Citizen Archivist work by by tagging and transcribing records.',
				'link_url': 'https://www.archives.gov/citizen-archivist',
				'link_text': 'Learn more'
			}
		]
	},
	// tag_reply_first and tag_reply_intermission are context-specific variations of
	// the tag_reply object. Any property not included will use tag_reply as a default
	'tag_reply_first': {
		'message': 'Congrats on your first tag! Every tag you provide makes American history more accessible.'
	},
	'tag_reply_intermission': {
		'message': 'You just did ROUND_COUNT documents in a row. How are you feeling?',
		'option_new': 'Keep going',
		'option_stop': 'I need a break',
		'followup_new': 'I like your attitude. Grabbing another document for you...',
		'followup_stop': 'Me too! FYI, our citizen archivist program invites you to tag and transcribe more documents. Find out more at https://www.archives.gov/citizen-archivist'
	},
	//
	// Fun Facts
	//
	'facts': [
		{
			'message': 'In true pop culture fashion, the most requested photo from the National Archives is of Nixon and The King.',
			'image': 'https://catalog.archives.gov/OpaAPI/media/1634221/content/arcmedia/Public_Vaults/5598_2004_a.jpg'
		},
		'The National Archives Building in downtown Washington, DC is built above an underground stream, the Old Tiber Creek.',
		'The National Archives was established in 1934 by President Franklin Roosevelt, but you could say it started with the birth of our great nation. Our documents date back to 1774.',
		'We\'re more than the Declaration of Independence (my eye is on you, Nicolas Cage wannabe). In Washington, DC, there are just about 10 billion (BILLION) pieces of paper alone. To read that many pages, you\'d have to read the entire Harry Potter series 3,197,953 times!',
		'You can be a virtual volunteer! Become a Citizen Archivist by transcribing and tagging records in our Catalog.',
	],
	'facts_reply': {
		'message': 'Want another?',
		'options': {
			'continue': 'Yes',
			'stop': 'No'
		}
	},
	//
	// Interesting Photos
	//
	'get_photo': 'Grabbing a photo...',
	'photos': [ 6011716, 1126974, 535579, 522880, 533758, 522888, 74249694, 532376, 6883309, 548550, 641627, 594412, 523373, 7387550, 2803422, 6816402, 75856835, 7348582, 16685274 ],
	'photos_reply': {
		'message': 'Want another?',
		'options': {
			'continue': 'Yes',
			'stop': 'No'
		}
	}
};

module.exports = script;
