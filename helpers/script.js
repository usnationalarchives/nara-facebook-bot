/**
 * The textual script used by the bot to interact with users.
 */

'use strict';

const script = {
	//
	// general
	//
	'default': 'Sorry, I didn\'t understand that. For more info, tap the menu below for more options.',
	'greeting': 'Hello {{user_first_name}}! Hit the "Get Started" button below.',
	'get_started': 'Want to help make history accessible? Tag the type of writing you see in our documents. You can also ask questions about the National Archives.',
	'menu': {
		'tag':    'Tag a document',
		'facts':  'Fun facts',
		'ask':    'Ask a question',
		'photos': 'Interesting photos',
		'submenu': 'More fun stuff',
	},
	'quick_menu': {
		'tag':    'Tag a document',
		'ask':    'Ask a question',
	},
	//
	// tagging
	//
	'tag_start': 'Let\'s go! I’m retrieving a document from the virtual stacks...',
	'tag_image_options': {
		'big':   'View larger size',
		'learn': 'Learn more'
	},
	'tag_prompt': {
		'message': 'Tag it! Select what kind of writing you see in the document.',
		'options': {
			'handwritten': 'Handwritten',
			'typed':       'Typed',
			'mixed':       'Both',
			'none':        'No writing',
			'skip':        'No idea'
		}
	},
	'tag_error': 'Something went wrong. Open the menu to try again or choose another option.',
	'tag_acknowledgment': {
		'handwritten': 'Tagged as handwritten.',
		'typed': 'Tagged as typed.',
		'mixed': 'Tagged as containing typed and handwritten text.',
		'none': 'Tagged as containing no writing.',
		'skip': 'No problem! Skipping this one.'
	},
	'tag_reply_first': {
		'message': 'Congrats on your first tag! Every tag you provide makes American history more accessible.',
		'options': {
			'new':   'Tag another document',
			'stop':  'Stop tagging',
		},
		'followup': {
			'new': 'You got it! Heading back to the virtual stacks to retrieve the next document...',
			'stop': 'That was fun! FYI, our citizen archivist program invites you to tag and transcribe more documents. Find out more at https://www.archives.gov/citizen-archivist'
		}
	},
	'tag_reply': [
		{
			'message': 'Good eye! Isn’t this fun? Want to tag another?',
			'options': {
				'new':   'Tag another document',
				'stop':  'Stop tagging'
			},
			'followup': {
				'new': 'You got it! Let me find you a good one...',
				'stop': 'That was fun! FYI, our citizen archivist program invites you to tag and transcribe more documents. Find out more at https://www.archives.gov/citizen-archivist'
			}
		},
		{
			'message': 'You’re on a roll! Only 38,999,999 more to go. (Just kidding!) Want to tag some more?',
			'options': {
				'new':   'Let\'s keep moving',
				'stop':  'Stop tagging'
			},
			'followup': {
				'new': 'Grabbing another document for you...',
				'stop': 'Every bit counts! FYI, our citizen archivist program invites you to tag and transcribe more documents. Find out more at https://www.archives.gov/citizen-archivist'
			}
		}
	],
	'tag_intermission': {
		'message': 'You just did ROUND_COUNT documents in a row. How are you feeling?',
		'options': {
			'new': 'Keep going',
			'stop': 'I need a break'
		},
		'followup': {
			'new': 'I like your attitude. Grabbing another document for you...',
			'stop': 'Me too! FYI, our citizen archivist program invites you to tag and transcribe more documents. Find out more at https://www.archives.gov/citizen-archivist'
		}
	},
	'tag_stop': 'That was fun! FYI, our citizen archivist program invites you to tag and transcribe more documents. Find out more at https://www.archives.gov/citizen-archivist',
	'stop_prompts': {
		'facts':  'Fun facts',
		'ask':    'Ask a question',
		'photos': 'Interesting photos'
	},
	//
	// facts
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
	'facts_switch': {
		'message': 'Would you like to do something else?',
		'options': {
			'tag': 'Tag documents',
			'ask': 'Ask a question',
			'photos': 'Interesting photos',
		}
	},
	//
	// photos
	//
	'get_photo': 'Grabbing a photo...',
	'photos': [ 6011716, 1126974, 535579, 522880, 533758, 522888, 74249694, 532376, 6883309, 548550, 641627, 594412, 523373, 7387550, 2803422, 6816402, 75856835, 7348582, 16685274 ],
	'photos_reply': {
		'message': 'Want another?',
		'options': {
			'continue': 'Yes',
			'stop': 'No'
		}
	},
	'photos_switch': {
		'message': 'Would you like to do something else?',
		'options': {
			'tag': 'Tag documents',
			'ask': 'Ask a question',
			'facts': 'Fun facts',
		}
	},
	'ask': [
		{
			'q': 'What is The Archives',
			'a': 'We are country\'s official record keeper. Along with making sure you have access to essential documents and preserving artifacts that tell the story of our history, we keep our nation\'s most precious documents safe from people like Nicolas Cage.',
		},
		{
			'q': 'How do I reach The Archives?',
			'a': 'Call us! (866) 272-6272',
		}
	],
	'ask_temp': 'Ask a question section placeholder.',
	'quit': {
		'stop': [
			'Leaving us already? Join us again soon! Visit the Archives blog to find more images, and select an option from the menu to start up again.',
		],
		'break': 'Me too! Select an option from the menu to start up again.',
	}
};

module.exports = script;
