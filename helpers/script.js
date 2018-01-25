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
	'exit': 'Thanks for playing! You tagged X images. Type "start" any time to start again.'
};

module.exports = script;
