
$(document).ready(function() {
    $("header").load("header.html");
    google.load("gdata", "1");
    google.setOnLoadCallback(getMyFeed);
});

var myService;
var feedUrl = "https://www.google.com/calendar/feeds/flockapplication@gmail.com/private/full";

function setupMyService() {
  myService = new google.gdata.calendar.CalendarService('flockapplication');
}

function getMyFeed() {
  setupMyService();
  myService.getEventsFeed(feedUrl, handleMyFeed, handleError);
}