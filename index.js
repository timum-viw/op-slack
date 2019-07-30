require('dotenv').config()
var app = require('express')();
var http = require('http').createServer(app);
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
  console.log(event);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'CLJT256GJ';

// Attach the event adapter to the express app as a middleware
app.use('/events', slackEvents.expressMiddleware());

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

app.get('/post', function(req, res){
    (async () => {
        const result  = await web.chat.postMessage({ channel: conversationId, text: 'Hello there' });
        res.send(`Message sent: ${res.ts}`);
    })()
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

