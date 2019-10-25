require('dotenv').config()
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const cors = require('cors')

const { WebClient } = require('@slack/web-api');

// const { createEventAdapter } = require('@slack/events-api');
// const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

// // Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
// slackEvents.on('message', (event) => {
// 	if(!event.thread_ts || event.bot_id) return
// 	io.to(event.thread_ts).emit('message', event.text)
// });

// // Handle errors (see `errorCodes` export)
// slackEvents.on('error', console.error);

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = process.env.CHANNEL_ID;

app.use(cors({ origin: '*', allowedHeaders: [ 'Authorization', 'Content-Type' ] }))

// Attach the event adapter to the express app as a middleware
//app.use('/events', slackEvents.expressMiddleware());
app.use(express.json())

app.get('/', function(req, res){
	console.log(req);
	res.send('<h1>Hello world</h1>');
});

app.post('/', function(req, res){
	web.chat.postMessage({ channel: conversationId, text: data.message, thread_ts: data.ts, username: socket.id })
	console.log(req);
	res.send('<h1>Hello world</h1>');
});



http.listen(process.env.PORT || 8001, function(){
	console.log('listening on *:8001');
});

