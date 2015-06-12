// Filename: sendreminders.js

// Twilio Account SID
var twilioAccountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Twilio Auth Token
var twilioAuthToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// Twilio phone number to send SMS from.
var twilioNumber = 'XXXXXXXXXX';

// Set to how frequently the queue should be checked.
var frequencyMilliseconds = 5000;

// Mongo DB server address
var mongooseServerAddress = 'mongodb://127.0.0.1:27017/test';

/*********** End Configuration ***********/

var client = require('twilio')(twilioAccountSid, twilioAuthToken);
var mongoose = require('mongoose');

mongoose.connect(mongooseServerAddress);

var Reminder = mongoose.model('Reminder', {
    text: String,
    time: Number,
    phonenumber: String
});

setInterval(function()
{
	var timeNow = new Date();
	console.log(Math.floor(timeNow.getTime()));

	// Find any reminders that have already passed, process them, and remove them from the queue.
	Reminder.find({"time": {$lt: Math.floor(timeNow.getTime())}}, function(err, reminders)
	{
		if(err)	{
			console.log(err);
			return;
		}

		if(reminders.length == 0)
		{
			console.log('no messages to be sent');
			return;
		}

		reminders.forEach(function(message)
		{
			client.messages.create({
			    body: message.text,
			    to: "+1"+message.phonenumber,
			    from: "+1"+twilioNumber
			}, function(err, sms) {
				if(err)
					console.log(err);

				console.log('sending '+message.text+' to '+message.phonenumber);
			    process.stdout.write(sms.sid);
			});
			
			Reminder.remove({_id: message._id}, function(err)
			{
				console.log(err)
			});
		});
	});
}, frequencyMilliseconds);
