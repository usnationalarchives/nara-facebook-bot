/**
 * The textual script used by the bot to interact with users.
 */

'use strict';

const script = {
	'welcome': 'Welcome to the National Archives Citizen Archivist Project! Help us identify text in historic images.',
	'welcomeBack': 'Welcome back!',
	'loop_start': 'Do you wish to begin tagging images?',
	'loop_continue': 'Do you wish to continue tagging images?',
	'loop_load': 'Great! Give me a second to dig through the archive...',
	'new': 'What kind of text is in this image?',
	'promptTap': 'What kind of text is in this image?',
	'tag_typed': 'Tagged as containing typed text.',
	'tag_handwritten': 'Tagged as containing handwritten text.',
	'tag_mixed': 'Tagged as containing both typed and handwritten text.',
	'tag_none': 'Tagged as not containing any text.',
	'tag_skip': 'No problem. Skipping this one.',
	'help': 'You\'re talking to the National Archives Citizen Archivist project. Type "start" to view an image and help us tag it. At any point, you can type "quit" to exit, "score" to see your score, or "help" to view this message again.',
	'score': 'You have tagged X images this round, and X images total. Great job!',
	'default': 'Sorry, I didn\'t understand that. For more options, type "help".',
	'exit': 'Thanks for playing! You tagged X images. Type "start" any time to start again.',

	// updated
	'greeting': 'Hello {{user_first_name}}!',
	'menu': {
		'facts':  'Fun The Archives Facts',
		'ask':    'Ask the Archives a question',
		'jokes':  'Tell a joke',
		'photos': 'Show me interesting photos',
		'tag':    'Help categorize documents'
	},
	'tag_prompt': {
		'message': 'Help us categorize this document.',
		'options': {
			'handwritten': 'Handwritten',
			'typed':       'Types',
			'mixed':       'Mixed',
			'none':        'No writing',
			'skip':        'No idea'
		}
	},
	'tag_reply': [
		{
			'message': 'Nailed it!',
			'options': {
				'learn':    'Learn more about this document',
				'continue': 'Let\'s keep moving',
			},
			'followup': 'You got it! Here\'s the next document.'
		},
		{
			'message': 'Very good, {{user_first_name}}. Do you want to know more or are you ready for another?',
			'options': {
				'learn':    'Learn more about this document',
				'continue': 'Let\'s keep moving',
			},
			'followup': 'You got it! Here\'s the next document.'
		},
		{
			'message': 'Shall I ramble on about this or do you want to move on?',
			'options': {
				'learn':    'Tell me all about it',
				'continue': 'Let\'s keep moving',
			},
			'followup': 'Here is the next document.'
		}
	],
	'tag_intermission': {
		'message': 'You just did five documents in a row. How are you feeling?',
		'options': {
			'break':  'I need a break',
			'facts':  'Fun The Archives Facts',
			'ask':    'Ask the Archives a question',
			'jokes':  'Tell a joke',
			'photos': 'Show me interesting photos',
			'tag':    'Keep going'
		},
	},
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
			'quit':     'See other options'
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
	'quit': {
		'stop': [
			'Leaving us already? Join us again soon! Visit the Archives blog to find more images, and select an option from the menu to start up again.',
			'Thank you for the help! Only 500,000,000 more to go! Select an option from the menu to start up again.',
		],
		'break': 'Me too! Select an option from the menu to start up again.',
	}
};

module.exports = script;
