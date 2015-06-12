// Filename: reminders.js

angular.module('reminderApp', [])
  .controller('ReminderListController', function($scope, $http, $filter) {
    var reminderList = this;

    reminderList.reminderDate = new Date();
    reminderList.reminderTime = new Date();
    reminderList.reminderTime.setMilliseconds(0);
    reminderList.reminderTime.setSeconds(0);
    reminderList.syncing = false;

    reminderList.reminders = [];

    // Get reminders from the server.
    reminderList.fetchList = function() {
      reminderList.syncing = true;
      
      $http.get('/api/reminders?phonenumber='+reminderList.phonenumber).success(function(response) {
        reminderList.reminders = response;
        reminderList.syncing = false;
      });
    };
 
    reminderList.addReminder = function() {
      var reminderDateTime = new Date($filter('date')(reminderList.reminderDate, 'yyyy-MM-dd')+" "+$filter('date')(reminderList.reminderTime, 'HH:mm'));

      var data = {
        text: reminderList.reminderText, 
        time: reminderDateTime.getTime(), 
        phonenumber: reminderList.phonenumber,
        done:false
      };

      $http.post('/api/reminders', data).success(function(response) {
        reminderList.reminders.push(response);
        reminderList.reminderText = '';
      });
    };
 
    reminderList.removeReminder = function(reminder) {
      var oldReminders = reminderList.reminders;
      console.log(reminder);
      reminderList.reminders = [];
      angular.forEach(oldReminders, function(r) {
        if(reminder._id != r._id) {
          reminderList.reminders.push(r);
        }
      });

      $http.post('/api/reminders/remove', {reminderId: reminder._id});
    };
  });
