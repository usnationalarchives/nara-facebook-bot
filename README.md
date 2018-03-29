# NARA Facebook Bot

Some notes on how to set up and test Facebook Messenger bots.

## Intro to Messenger Bots

Bots exist on Facebook's Messenger platform.

Bots are associated with a particular Facebook page. When a user sends a message to that page, they begin interacting with the bot.

## Setup

To set up a bot, you need the following:

### 1. Facebook page

Create one at https://www.facebook.com/pages/create.

Or use the one we've already set up at https://www.facebook.com/ChiefMessengerLab/.

### 2. Facebook developer account

Sign up at https://developers.facebook.com/.

### 3. Webhook

Any time a user sends a message or takes any action with your bot, an event is sent to a particular URL called a webhook. That server is where the bot code (i.e. this repository) should be stored. The code interprets the event and sends one or more messages back.

### 4. Facebook App

You can set one up at https://developers.facebook.com/apps.

Instructions: https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup.

Or use the one we've already set up by asking an existing developer for access.

## Required Environment Variables

These should be stored as node.js environment variables on the bot server.

<dl>
<dt>URL</dt>
<dd>Full URL where app is located. Example: <code>https://md-facebook-bot-test.herokuapp.com/</code>.</dd>
<dt>VERIFY_TOKEN</dt>
<dd>Random string of your choice. Needed once to verify the webhook when first setting up the Facebook app.</dd>
<dt>PAGE_ACCESS_TOKEN</dt>
<dd>Get from Facebook after successfully creating Facebook app. Required to enable messaging.</dd>
<dt>AWS_SECRET_KEY</dt>
<dd>Get from AWS.</dd>
<dt>AWS_ACCESS_KEY</dt>
<dd>Get from AWS.</dd>
</dl>

## Access

Before a bot is publicly available (https://developers.facebook.com/docs/messenger-platform/submission-process), testing the bot within Messenger requires certain access:

- Must be an admin or tester within the app (https://developers.facebook.com > My Apps > select app > Roles).
- Must be an admin of the Facebook page (e.g. https://www.facebook.com/ChiefMessengerLab/ > Settings > Page Roles).

Once you have access, you can interact with the bot by going to https://m.me/ChiefMessengerLab.

## More Catches

Check the Facebook page > Settings > Messenger Platform for additional settings:

- Ensure "responses are all automated" is selected
- Ensure the app appears under "Subscribed Apps"
- Ensure any domain the bot uses is listed under "Whitelisted Domains"
