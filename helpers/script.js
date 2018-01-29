/**
 * The textual script used by the bot to interact with users.
 */

'use strict';

const script = {
	'default': 'Sorry, I didn\'t understand that. For more info, type "help". You can also click the menu icon for more options.',
	'greeting': 'Hello {{user_first_name}}! Hit the "Get Started" button below.',
	'get_started': 'Hello! I\'m a bot for the U.S. National Archives and Records Administration. Click the menu icon to do something. You can become a citizen archivist by helping us categorize documents, find answers, and see interesting facts and photos.',
	'menu': {
		'tag':    'Help categorize documents',
		'facts':  'Fun The Archives Facts',
		'ask':    'Ask the Archives a question',
		'jokes':  'Tell a joke',
		'photos': 'Show me interesting photos'
	},
	'tag_start': 'Let\'s go! Digging through the Archive...',
	'tag_prompt': {
		'message': 'Help us categorize this document. What kind of text is in this image?',
		'options': {
			'handwritten': 'Handwritten',
			'typed':       'Typed',
			'mixed':       'Mixed',
			'none':        'No writing',
			'skip':        'No idea'
		}
	},
	'tag_error': 'Something went wrong. Open the menu again to try again or choose another option.',
	'tag_reply': [
		{
			'message': {
				'handwritten': 'Nailed it! Marked as handwritten.',
				'typed': 'Nailed it! Marked as typed.',
				'mixed': 'Nailed it! Marked as containing typed and handwritten text.',
				'none': 'Nailed it! Marked as containing no writing.',
				'skip': 'No problem! Skipping this one.'
			},
			'options': {
				'learn': 'Learn more',
				'new':   'Let\'s keep moving',
				'stop':  'Stop'
			},
			'followup': 'You got it! Here\'s the next document.'
		},
		{
			'message': {
				'handwritten': 'Very good! Marked as handwritten. Do you want to know more or are you ready for another?',
				'typed': 'Very good! Marked as typed. Do you want to know more or are you ready for another?',
				'mixed': 'Very good! Marked as containing typed and handwritten text. Do you want to know more or are you ready for another?',
				'none': 'Very good! Marked as containing no writing. Do you want to know more or are you ready for another?',
				'skip': 'Sure, we can skip this. Do you want to know more or are you ready for another?'
			},
			'options': {
				'learn': 'Learn more',
				'new':   'Let\'s keep moving',
				'stop':  'Stop'
			},
			'followup': 'You got it! Here\'s the next document.'
		},
		{
			'message': 'Thanks! Shall I ramble on about this or do you want to move on?',
			'message': {
				'handwritten': 'Thanks! Marked as handwritten. Shall I ramble on about this or do you want to move on?',
				'typed': 'Thanks! Marked as typed. Shall I ramble on about this or do you want to move on?',
				'mixed': 'Thanks! Marked as containing typed and handwritten text. Shall I ramble on about this or do you want to move on?',
				'none': 'Thanks! Marked as containing no writing. Shall I ramble on about this or do you want to move on?',
				'skip': 'Sure, you don\'t have to tag this one. Shall I ramble on about it or do you want to move on?'
			},
			'options': {
				'learn': 'Tell me all about it',
				'new':   'Let\'s keep moving',
				'stop':  'Stop'
			},
			'followup': 'Here is the next document.'
		}
	],
	'tag_learn_reply': {
		'message': 'Are you ready for another?',
		'options': {
			'new': 'Let\'s keep moving',
			'stop': 'Stop'
		}
	},
	'tag_intermission': {
		'message': 'You just did ROUND_COUNT documents in a row, and a total of TOTAL_COUNT documents. How are you feeling?',
		'options': {
			'learn': 'Learn more'
			'stop': 'I need a break',
			'new': 'Keep going'
		},
	},
	'tag_stop': 'Thank you for the help! Only 500,000,000 more to go! Select an option from the menu if you\'d like to do something else.',
	'facts': [
		'In true pop culture fashion, the most requested photo from The Archives is of Nixon and The King.',
		'The National Archives Building in downtown Washington, DC, is built above an underground stream, the Tiber Creek.',
		'The Archives was established in 1934 by President Franklin Roosevelt, but you could say it started with the birth of our great nation. Our documents date back to 1775.',
		'We\'re more than the Declaration of Independence (my eye is on you, Nicolas Cage wannabe). There are just about 10 billion (BILLION) pages of textual records. To read that many pages, you\'d have to read the entire Harry Potter series 3,197,953 times!',
		'Our most searched inquiry is asking about UFOs.'
	],
	'facts_reply': {
		'message': 'Want another?',
		'options': {
			'continue': 'Yes',
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
	'jokes': [
		{
			'q': 'How would you look up Lincoln\'s location in Pennsylvania?',
			'options': {
				'a1': 'No idea',
				'a2': 'What\'s he doing in Pennsylvania?'
			},
			'a1': 'He\'s at the Gettysburg Address.',
			'a2': 'I think it\'s time to go back to 5th grade.'
		},
		{
			'q': 'Why did Edison invent the light bulb?',
			'options': {
				'a1': 'I slept during that lecture.',
				'a2': 'No idea',
			},
			'a': 'So that he could see at night, were you expecting a joke?'
		},
		{
			'q': 'The year is 1924, where do you go for a drink?',
			'options': {
				'a1': 'No idea',
				'a2': 'At Gatsby\'s?'
			},
			'a1': 'I don\'t know either, but if you figure it out, speakeasy about it.',
			'a2': 'Great, I\'m coming with you.'
		}
	],
	'jokes_reply': {
		'message': 'Want to hear another joke?',
		'options': {
			'continue': 'Yes',
		}
	},
	'photos_temp': 'Photos section placeholder.',
	'quit': {
		'stop': [
			'Leaving us already? Join us again soon! Visit the Archives blog to find more images, and select an option from the menu to start up again.',
		],
		'break': 'Me too! Select an option from the menu to start up again.',
	}
};

module.exports = script;
