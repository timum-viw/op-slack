require('dotenv').config()
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const cors = require('cors')

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
	if(!event.thread_ts || event.bot_id) return
	io.to(event.thread_ts).emit('message', event.text)
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = process.env.CHANNEL_ID;

app.use(cors({ origin: '*', allowedHeaders: [ 'Authorization', 'Content-Type' ] }))

// Attach the event adapter to the express app as a middleware
app.use('/events', slackEvents.expressMiddleware());
app.use(express.json())

app.get('/', function(req, res){
	res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
	socket.on('message', data => {
		web.chat.postMessage({ channel: conversationId, text: data.message, thread_ts: data.ts, username: socket.id })
			.then( result => {
				if(!data.ts) {
					socket.emit('ts', result.ts) 
					socket.join(result.ts)
					socket.emit('message', 'Vielen Dank für dein Feedback. Du kannst uns gerne weiter schreiben, wenn dir noch etwas auffällt!!')
				}
			})
			.catch( err => console.error(err) )
	})

	socket.on('join', data => {
		socket.join(data)
	})
});

http.listen(process.env.PORT || 8001, function(){
	console.log('listening on *:8001');
});

