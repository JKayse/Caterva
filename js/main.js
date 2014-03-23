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
    $(document).on('click', "#cancelFriends", cancelAddFriendsPopUp);
    $(document).on('click', "#cancelGroups", cancelAddGroupsPopUp);

    $(document).on('click', "#addFriendsEvent", showAddFriendsPopUp);
    $(document).on('click', "#addGroupsEvent", showAddGroupsPopUp);

    $(document).on('submit', "#friendSearch", searchForFriend);
    $(document).on('submit', "#friendAdder", addFriendstoEvent);
    $(document).on('submit', "#groupAdder", addGroupstoEvent);

    $(document).on('click', "#deleteInvitedGuest", deleteInvitedGuest);


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

function showAddFriendsPopUp(){
    $("#addFriendsOptions").show();
    $("#enterEvent").hide();
}

function showAddGroupsPopUp(){
    $("#addGroupsOptions").show();
    $("#enterEvent").hide();
}

function cancelAddFriendsPopUp(){
    $("#addFriendsOptions").hide();
    $("#enterEvent").show();
    $(".friendList").prop('checked', false);
}

function cancelAddGroupsPopUp(){
    $("#addGroupsOptions").hide();
    $("#enterEvent").show();
    $(".groupList").prop('checked', false);
}

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
    $("#eventGuestList").empty()
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

function searchForFriend(event){
    event.preventDefault();
    /*$.ajax({
            type: "POST",
            url: "api/SearchFriend",
            data: {
                username: $("#friendsUsername").val(),
                userId: userId;
            },
            success: function(json){
                if(json === "null"){
                    alert("That username does not exist. Please try Again.");
                }
                else{
                    $("#friendsUsername").val("");
                    $("#blackScreenofDeath").hide();
                    $("#popUp").hide();
                    $("#enterFriend").hide();
                }

            }
    });*/

    $("#friendsUsername").val("");
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#enterFriend").hide();
}

function addFriendstoEvent(event){
    event.preventDefault();
    var friendstoAdd="";
    var friendsList = $(".friendList");
    for(var i = 0; i < friendsList.size(); i++){
        if($(".friendList").eq(i).prop('checked') === true){
            $("#eventGuestList").append("<span class='invitedGuest'><img src='img/close.png' id='deleteInvitedGuest' alt='Uninvite this friend.' title='Uninvite friend.'><h4> "+ $(".friendList").eq(i).next().html() + "</h4></span>");
        }
    }    
    $("#addFriendsOptions").hide();
    $("#enterEvent").show();
    $(".friendList").prop('checked', false);
}


function addGroupstoEvent(event){
    event.preventDefault();
    var groupstoAdd="";
    var groupFriends="";
    var groupsList = $(".groupList");
    for(var i = 0; i < groupsList.size(); i++){
        if($(".groupList").eq(i).prop('checked') === true){
            groupFriends = $(".groupList").eq(i).attr("friends");
            var friends = groupFriends.split(", ");
                for(var k = 0; k < friends.length; k++){
                    $("#eventGuestList").append("<span class='invitedGuest'><img src='img/close.png' id='deleteInvitedGuest' alt='Uninvite this friend.' title='Uninvite friend.'><h4> "+ friends[k] + "</h4></span>");
                }
        }
    }
    $("#addGroupsOptions").hide();
    $("#enterEvent").show();
    $(".groupList").prop('checked', false);
}

function deleteInvitedGuest(){
    $(this).parent().remove();
}