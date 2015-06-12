// Filename: twiliotest.js
// Your accountSid and authToken from twilio.com/user/account
var accountSid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var authToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// Replace with path to the node module (i.e. /usr/local/lib/node_modules/twilio)
var client = require('twilio')(accountSid, authToken);

client.messages.create({
	body: "Don’t forget to finish project 2!",
	to: "+15555555555", // Change to your verified phone number
	from: "+15555555555" // Change to Twilio phone number
}, function(err, message) {
	process.stdout.write(message.sid);
});
