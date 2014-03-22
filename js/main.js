var userId;


$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', ".groupButton", openList);
    $(".event img").width($(".event img").height());
    $(document).on('click', "#editFriends", goToEditPage);
    $(document).on('click', "#addFriend", addFriend);
    $(document).on('click', "#createEvent", addEvent);
    $(document).on('click', "#cancelSearch", cancelFriendPopUp);
    $(document).on('click', "#cancelEvent", cancelCreateEventPopUp);

/*
    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            json = JSON.parse(json);
            userId = json.ID;    
        }
        else{
            return;
        }
    }});   


    $.ajax({url:"api/FriendRequests/" + userId, success: function(json2){
        json2 = JSON.parse(json2);
        var friendRequests = json2.friendRequests;
        for(var i = 0; i < friendRequests.length ; i++){
            var username = friendRequests[i].username;
            var friendId = friendRequests[i].friendId;
            var friend = "<div class='friendRequest' friendId=" + friendId + "><h4>Add "+ username +"?</h4><img src='img/greenCheck.png' alt='Green Check' title='No'><img src='img/redX.png' alt='Red X' title='No'></div>";
            $("#friendRequestList").append(friend);
        }

    }}); 
*/

});

function cancelFriendPopUp(){
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#enterFriend").hide();
    $("#friendsUsername").val("");
}

function cancelCreateEventPopUp(){
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#enterEvent").hide();

    $("#eventTitle").val("");
    $("#eventDescription").val("");
    $("#eventDate").val("");
    $("#eventDateEnd").val("");
    $("#eventTimeStart").val("");
    $("#eventTimeEnd").val("");
    $("#eventGuestList").val("");
    $("#allowShareEvent").prop('checked', false);
}


function openList(){
    $(this).toggleClass("clickedGroup");
    $(this).next().toggle();
}


function goToEditPage(){
    window.location = "edit.html";
}

function addFriend(){
    $("#blackScreenofDeath").show();
    $("#popUp").show();
    $("#enterFriend").show();
}

function addEvent(){
    $("#blackScreenofDeath").show();
    $("#popUp").show();
    $("#enterEvent").show();
}
