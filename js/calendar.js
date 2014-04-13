
$(document).ready(function() {
    $("header").load("header.html");
    google.load("gdata", "1");
    google.setOnLoadCallback(getMyFeed);

});