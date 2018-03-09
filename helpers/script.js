/**
 * The textual script used by the bot to interact with users.
 */

'use strict';

const script = {
	//
	// General
	//
	'default': [
		'Sorry, I didn\'t understand that. Have you tried asking your question on the History Hub? This site is designed to assist researchers: http://history.gov',
		'I see what you\'re getting at, but no, you still cannot touch the Declaration of Independence.',
		'I didn\'t quite catch that, type "help" or try the menu below.',
		'Sorry, I didn\'t understand that. For more info, type "help". You can also try the menu below for more options.'
	],
	'greeting': 'Hello {{user_first_name}}! Hit the "Get Started" button below.',
	'get_started': 'Hello! Want to help make history accessible? Tag the type of writing you see in our documents. You can also ask questions about the National Archives.',
	'menu': {
		'tag': 'Tag a Document',
		'facts': 'Archives Trivia',
		'ask': 'Ask a Question',
		'photos': 'Interesting Photos',
		'submenu': 'More Fun Stuff',
		'stop': 'Stop'
	},
	'help': 'You\'re talking to the National Archives Facebook page. Here you can help make history accessible by tagging the type of writing you see in our documents. You can also ask questions about the National Archives, see interesting photos, or learn Archives trivia. Tap an option in the menu below to continue, or type "start".',
	'switch_section': 'Would you like to do something else?',
	'ask_temp': 'Ask a question section placeholder.',
	'share': {
		'message': 'National Archives - Citizen Archivist Project',
		'link_url': 'http://m.me/ChiefMessengerLab',
		'link_text': 'Try it out'
	},
	'stop': [
		'Want to receive our twice-monthly newsletter? Sign up here: https://www.archives.gov/research/catalog/newsletter',
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
		'message': 'You just did 5 documents in a row. How are you feeling?',
		'option_new': 'Keep going',
		'option_stop': 'I need a break',
		'followup_new': 'I like your attitude. Grabbing another document for you...',
		'followup_stop': {
			'message': 'Me too! FYI, our citizen archivist program invites you to tag and transcribe more documents.',
			'link_url': 'https://www.archives.gov/citizen-archivist',
			'link_text': 'Find out more'
		}
	},
	'tag_round_length': 5, // the amount of tags to process before showing the intermission message. if this is changed, remember to also change the message
	//
	// Q&A
	//
	'ask': {
		'back_text': 'Back',
		'message': 'Select a category below.',
		'categories': [
			{
				'category': 'General Info',
				'message': 'What would you like to know?',
				'categories': [
					{
						'category': 'About the Archives',
						'message': 'The National Archives and Records Administration is the nation\'s record keeper. Of all documents and materials created in the course of business conducted by the United States Federal government, only 1%-3% are so important for legal or historical reasons that they are kept by us forever. Learn more about archives and archivists: https://www.archives.gov/about'
					},
					{
						'category': 'Use & Attribution',
						'message': 'Most of the images in our digital catalog (https://catalog.archives.gov/) or YouTube channel (https://www.youtube.com/USNationalArchives) are not under copyright, but it is your responsibility to confirm that. Please credit us when you use them.'
					}
				]
			},
			{
				'category': 'Visiting',
				'message': 'Select an option to learn more.',
				'categories': [
					{
						'category': 'Hours',
						'message': 'The National Archives Museum (https://www.archives.gov/museum/visit/) in Washington, DC, is open seven days a week from 10 a.m. to 5:30 p.m. (closed Thanksgiving Day and Christmas Day). The Research Center (https://www.archives.gov/dc-metro/washington) in Washington, DC, and the Research Rooms (https://www.archives.gov/dc-metro/college-park) in College Park, MD, are open Monday through Friday from 8:45 a.m. to 5:45 p.m. If you\'re looking for Research Room hours at any of our other locations, you can start your search here: https://www.archives.gov/locations'
					},
					{
						'category': 'Admission',
						'message': 'The National Archives Museum is open seven days a week from 10 am. to 5:30 p.m. (closed Thanksgiving Day and Christmas Day). Admission is always free! You can find more information about visiting the Museum here: https://www.archives.gov/museum/visit/. You can also reserve a timed entry or a guided tour: https://www.archives.gov/museum/visit/reserved-visits.html'
					},
					{
						'category': 'Photography Rules',
						'message': 'Photography of any kind is prohibited in all exhibition areas of the National Archives. Photography can damage the documents. You can download a high-res image of most of our displayed documents from our online catalog: https://catalog.archives.gov/'
					},
					{
						'category': 'What\'s on Display',
						'message': 'We have several permanent displays in the National Archives Museum (learn more: https://www.archives.gov/museum/visit/index.html), but the exhibit in the Lawrence F. O\'Brien Gallery changes about every 18 months. We also have Featured Document displays that change every month or two. To learn more about what\'s currently on display, visit us here: https://www.archives.gov/exhibits'
					}
				]
			},
			{
				'category': 'Contact',
				'message': 'Want to get in touch? Let us know how we can help: https://www.archives.gov/contact',
				'categories': [
					{
						'category': 'Problem with Order?',
						'message': 'We\'re sorry to hear that there\'s a problem with your research order! Please send us an email at inquire@nara.gov and let us know how we can help.'
					}
				]
			},
			{
				'category': 'Research',
				'message': 'Select an option to learn more.',
				'categories': [
					{
						'category': 'Get Research Help',
						'message': 'We can\'t do your research for you, but we can help get you started: https://www.archives.gov/research/start/plan-visit-0 You can also post your question over at our History Hub (https://history.gov/welcome) for some help from our experts. And you can hire someone (https://www.archives.gov/research/hire-help) to do the research for you.'
					},
					{
						'category': 'Where to Go',
						'message': 'National Archives facilities are located across the country. Start here to find out which location may hold the documents you\'re looking for: https://www.archives.gov/research/start/step2-gather-information.html#locate'
					},
					{
						'category': 'Online Research',
						'message': 'You can search our online catalog here: https://catalog.archives.gov/'
					},
					{
						'category': 'Family Records',
						'message': 'The National Archives is a treasure trove for family research! Learn more about starting your genealogical research here: https://www.archives.gov/research/genealogy/start-research'
					},
					{
						'category': 'Request DD-214',
						'message': 'You can request military personnel records including DD-214s here: https://www.archives.gov/veterans/military-service-records'
					},
					{
						'category': 'Military Records',
						'message': 'You can request military records from the National Archives in St. Louis (https://www.archives.gov/veterans/military-service-records). If you have an urgent request (for upcoming surgery or burial), follow these instructions: https://www.archives.gov/veterans/military-service-records#emergency'
					},
					{
						'category': 'Replacement Medals',
						'message': 'The National Archives doesn\'t issue replacement medals, but you can learn more about how to make that request here: https://www.archives.gov/veterans/replace-medals'
					}
				]
			}
		]
	},
	//
	// Fun Facts
	//
	'facts': [
		'The National Archives Building in downtown Washington, DC, is built above an underground stream, the Old Tiber Creek.',
		'The National Archives was established in 1934 by President Franklin Roosevelt. Before that, records were kept by the agencies and sometimes even in garages, attics, and basements of Federal buildings! https://www.archives.gov/about/history',
		'You can be a virtual volunteer! Become a Citizen Archivist by transcribing and tagging records in our Catalog. https://www.archives.gov/citizen-archivist',
		'The National Archives is known as the nation\'s record keeper. Of all the documents and materials created in the course of business conducted by the United States Federal government, only 1%-3% are so important for legal or historical reasons that they are kept by us forever. And that still amounts to 130 billion pages!',
		'The most downloaded image from our Catalog is the Engrossed Declaration of Independence: https://catalog.archives.gov/id/1419123 Explore and download more from our digital holdings at https//catalog.archives.gov',
		'There are approximately 13 billion pages of textual records at the National Archives, but we\'re more than just paper. We also house 12 million maps, charts, and architectural and engineering drawings; 25 million still photographs and graphics; 24 million aerial photographs; 300,000 reels of motion picture film; 400,000 video and sound recordings; and 133 terabytes of electronic data.',
		'The Rotunda of the National Archives Museum in Washington, DC, holds the Declaration of Independence, the Constitution, and the Bill of Rights.',
		'Get your Presidential Libraries passport and take a roadtrip across the country. Each Presidential Library has its own unique commemorative stamp. After collecting all of them, you can collect a special gift from one of the museum stores.',
		'We celebrate Independence Day with a special dramatic reading of the Declaration of Independence. Join us on July 4 for some patriotic festivities on the steps of the National Archives Building -- it\'s our most popular event of the year!',
		'Did you know that admission to the National Archives Museum is always free? Start planning your visit today! https://www.archives.gov/museum/',
		'The Declaration of Independence is housed in a sealed encasement filled with the inert gas argon and with controlled temperature and humidity to keep the parchment flexible.',
		'The Constitution was not America\'s first constitution. The Articles of Confederation was the plan of government in effect from 1781 to 1787. It was based on the principles of the Declaration of Independence, but specified no central powers over taxation and trade, nor the ability to compel the states to fulfill national obligations.',
		'The earliest sound recordings were made on wax cylinders. You can hear a rare recording of Theodore Roosevelt speaking in the Public Vaults exhibition at the National Archives Museum in Washington, DC. https://www.archives.gov/museum/visit/vaults.html',
		'You might want to bring a sweater when you visit the Declaration, Constitution, and Bill of Rights. Thermostats and light levels in the Rotunda are deliberately kept low because cooler temperatures prolong the life of documents and light fades ink and destroys parchment and paper.',
		'The National Archives Building was designed by architect John Russell Pope as a temple to history. Pope also designed the Jefferson Memorial; do you see any similarities? https://catalog.archives.gov/id/35810272 https://catalog.archives.gov/id/7873491',
		'The National Archives Building stands at 166 feet tall, 213 feet wide, and 330 feet long.',
		'At the top of grand staircase of the National Archives Building rest two giant bronze doors leading to the Rotunda. Each door weighs 6.5 tons and is 38.7 feet high, 10 feet wide, and 11 inches thick. But don\'t worry about holding the door open for the next person in line; these doors no longer function as the main entrance to the National Archives and are rarely opened (but continue to be an impressive feature of the building!).'
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
	'photos': [ // array of NaIds, can add any amount
		6011716,
		1126974,
		535579,
		522880,
		533758,
		522888,
		74249694,
		532376,
		6883309,
		548550,
		641627,
		594412,
		523373,
		7387550,
		2803422,
		6816402,
		75856835,
		7348582,
		16685274
	],
	'photos_reply': {
		'message': 'Want another?',
		'options': {
			'continue': 'Yes',
			'stop': 'No'
		}
	}
};

module.exports = script;
