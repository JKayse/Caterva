

$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', ".groupButton", openList);
    $(".event img").width($(".event img").height());

    $(document).on('click', "#editFriends", goToEditPage);
    $(document).on('click', "#addFriend", addFriend);
    $(document).on('click', "#createEvent", addEvent);
    $(document).on('click', ".cancelSearch", cancelFriendPopUp);
    $(document).on('click', ".cancelEvent", cancelCreateEventPopUp);
    $(document).on('click', ".cancelFriends", cancelAddFriendsPopUp);
    $(document).on('click', ".cancelGroups", cancelAddGroupsPopUp);

    $(document).on('click', "#addFriendsEvent", showAddFriendsPopUp);
    $(document).on('click', "#addGroupsEvent", showAddGroupsPopUp);

    $(document).on('submit', "#friendSearchForm", searchForFriend);
    $(document).on('submit', "#friendAdder", addFriendstoEvent);
    $(document).on('submit', "#groupAdder", addGroupstoEvent);  
    $(document).on('submit', "#eventCreator", addCreatedEvent);

    $(document).on('click', "#deleteInvitedGuest", deleteInvitedGuest);
    $(document).on('click', ".friend", goToProfilePage);

    $(document).on('click', "#sendFriendRequest", sendFriendRequest);
    $(document).on('click', ".closeFriendRequest", closeFriendRequest);
    
    $(document).on('click', ".friendRequest img", updateFriendRequest);
    $(document).on('click', ".eventRequest img", updateEventRequest);

    $(document).on('click', ".eventRequest h4", viewEventInformation);
    $(document).on('click', ".event", viewAttendingEventInformation);

    $(document).on('click', ".closeEventInformation", closeEventInformation);

    $('.mouseover').slimScroll({
        height: '83%'
    });
    
    $(".mouseover").height('100%');
    $(".slimScrollRail").hide();
    $(".slimScrollBar").hide();




    /*$.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            json = JSON.parse(json);  
        }
        else{
            return;
        }
    }});  */


 /*   $.ajax({url:"api/ViewFriendRequest", success: function(json2){
        json2 = JSON.parse(json2);
        var friendRequests = json2.FriendRequest;
        for(var i = 0; i < friendRequests.length ; i++){
            //var username = friendRequests[i].username;
            var friendId = friendRequests[i].UserId;
            $.ajax({url:"api/UserInfo/" + friendId, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
                var username = friendInfo[0].Username;
                var userId = friendInfo[0].UserId;

                var friend = "<div class='friendRequest' friendId=" + userId + "><h4>Add "+ username +"?</h4><img src='img/redX.png' alt='Red X' title='No'><img src='img/greenCheck.png' alt='Green Check' title='Yes'></div>";
                $("#friendRequestList").append(friend);
            }});
        }
    }}); 
*/
    $.ajax({url:"api/ViewFriends", success: function(json2){
        json2 = JSON.parse(json2);
        var friends = json2.FriendsList;
        for(var i = 0; i < friends.length ; i++){
            var friendId = friends[i].FriendId;
            $.ajax({url:"api/UserInfo/" + friendId, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
                console.log(friendInfo);
                var firstname = friendInfo[0].Firstname;
                var lastname = friendInfo[0].Lastname;
                var userId = friendInfo[0].UserId;
                var friend = "<button class='friend' type='button' friendId=" + userId + ">"+ firstname +" "+ lastname+ "</button>";
                $("#friendList").append(friend);
                var friendAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friend' title='Invite' name='invitedFriends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                $("#friendAdderList").append(friendAdder);
                $("#flockList button").css("font-size", $(".friendRequest").css("font-size"));
            }});    
        }

    }}); 
/*
    $.ajax({url:"api/ViewGroups/" + userId, success: function(json2){
        json2 = JSON.parse(json2);
        var groups = json2.groups;
        for(var i = 0; i < groups.length ; i++){
            var groupName = groups[i].groupName;
            var groupId = groups[i].groupName;
            var groupList = groups[i].groupList;
            var friendList = "";
            var friendIdList = "";

            var group = "<button class='groupButton' type='button' groupId =" + groupId + ">" + groupName + " </button><div class='groupMembers' groupId =" + groupId + ">" ;

            var groupAdder = "<input type='checkbox' class='groupList' id=" + groupId + "friends='";

            for(var j = 0; j < groupList.length; j++){
                var firstName = groupList[j].firstName;
                var lastName = groupList[j].lastName;
                var friendId = groupsList[j].friendId;

                group = group + "<button class='friend' type='button' friendId =" + friendId + ">" + firstName + " " + lastName + "</button>";

                friendList = friendList + ", " + firstName + " " + lastName;
                friendIdList = friendIdList + ", " + friendId;
            }

            friendList = friendList.substring(2);
            friendIdList = friendIdList.substring(2);

            group = group + "</div>";
            $("#groupList").append(group);

            groupAdder = groupAdder + friendList + "' friendIds = '" + friendIdList + "' title ='Invite' name='invitedGroups'><label for=" + groupId + ">" + groupName + "</label><br>";
             $("groupAdderList").append(groupAdder);
             $("#flockList button").css("font-size", $(".friendRequest").css("font-size"));
        }



    }}); */


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
    $("#friendSearchForm").hide();
    $("#friendSearch").hide();
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
    $("#eventGuestList").empty();
    $("#allowShareEvent").prop('checked', false);
}


function openList(){
    $(this).toggleClass("clickedGroup");
    $(this).next().toggle();
}


function goToEditPage(){
    window.location = "edit.html";
}

function goToProfilePage(){
    window.location = "profile.html";
}

function addFriend(){
    $("#blackScreenofDeath").show();
    $("#popUp").show();
    $("#friendSearch").show();
    $("#friendSearchForm").show();
}

function addEvent(){
    $("#blackScreenofDeath").show();
    $("#popUp").show();
    $("#enterEvent").show();
}

function searchForFriend(event){
    event.preventDefault();
    $.ajax({
            type: "POST",
            url: "api/SearchFriend",
            data: {
                username: $("#friendsUsername").val(),
            },
            success: function(json){
                json = JSON.parse(json);
                var friend = json.Friend;
                if(friend.length === 0){
                    alert("That username does not exist. Please try Again.");
                }
                else{
                    var friendId = friend[0].userId;
                    $.ajax({url:"api/UserInfo/" + friendId, success: function(json2){
                        json2 = JSON.parse(json2);
                        var friendInfo = json2.User;
                        var username = friendInfo[0].Username;
                        var userId = friendInfo[0].UserId;

                        var values = $("#foundFriend h3");
                        values.eq(0).html(username + " was found!")
                        values.eq(0).attr("friendId", userId);
                        values.eq(1).html("Add " + username +" as a friend?")
                        //$("#foundFriend img").attr("src", "img/" + userId + ".png");
                        $("#friendsUsername").val("");
                        $("#friendSearchForm").hide();
                        $("#foundFriend").show();
                        $("#foundFriend img:not([title='Close'])").height($("#foundFriend img:not([title='Close'])").width());

                    }});   
                }

            }
    });
}

function addFriendstoEvent(event){
    event.preventDefault();
    var friendstoAdd="";
    var friendsList = $(".friendList");
    for(var i = 0; i < friendsList.size(); i++){
        if($(".friendList").eq(i).prop('checked') === true){
            $("#eventGuestList").append("<span class='invitedGuest' friendId=" + $(".friendList").eq(i).attr("friendId") + "><img src='img/close.png' id='deleteInvitedGuest' alt='Uninvite this friend.' title='Uninvite friend.'><h4> "+ $(".friendList").eq(i).next().html() + "</h4></span>");
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

function addCreatedEvent(event){
    event.preventDefault();
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#enterEvent").hide();

    var invitedList = [];
    var event = {};
    var friend = {};

    event.title = $("#eventTitle").val();
    event.description = $("#eventDescription").val();
    event.startDate = $("#eventDate").val();
    event.startTime = $("#eventTimeStart").val();
    event.endDate = $("#eventDateEnd").val();
    event.endTime = $("#eventTimeEnd").val();
    
    var invited = $(".invitedGuest");
    for(var i = 0; i < invited.size(); i++){
        friend.friendId = invited.eq(i).attr("friendId");
        invitedList.push(friend);
    }   
    event.invited = invitedList; 

    if($("#allowShareEvent").prop('checked') === false)
    {
        event.share = 0;
    }
    else{
        event.share = 1;
    }


    event = JSON.stringify(event);
    console.log(event);

    $.ajax({
            type: "POST",
            url: "api/CreateEvent",
            data: {
                event: event
            },
            success: function(json){
                /*if(json === "error_groupName"){
                    alert("That name already exists. Please enter a new name.");
                }*/
                //else{          
                        $("#eventTitle").val("");
                        $("#eventDescription").val("");
                        $("#eventDate").val("");
                        $("#eventDateEnd").val("");
                        $("#eventTimeStart").val("");
                        $("#eventTimeEnd").val("");
                        $("#eventGuestList").empty();
                        $("#allowShareEvent").prop('checked', false);
                        //updateGroupList();
                //}
            }
    });

    //When function is there, add it to the event list.


}

function sendFriendRequest(){
    console.log($("#foundFriend h3").eq(0).attr("friendId"));
    $.ajax({
            type: "POST",
            url: "api/AddFriendRequest",
            data: {
                friendId: $("#foundFriend h3").eq(0).attr("friendId"),
            },
            success: function(json){
                $("#enterFriend form").show();
                $("#enterFriend").hide(); 
                $("#popUp").hide(); 
                $("#blackScreenofDeath").hide(); 
                $("#foundFriend").hide(); 

            }
    });
}

function closeFriendRequest(){
    $("#enterFriend form").show();
    $("#enterFriend").hide(); 
    $("#popUp").hide(); 
    $("#blackScreenofDeath").hide(); 
    $("#foundFriend").hide(); 
}

function updateFriendRequest(){
    var response;
    var friendId;
    if($(this).attr("title") === "Yes"){
       response=1;
    }
    else{
        response=0;
    }
    $.ajax({
            type: "POST",
            url: "api/AddFriend",
            data: {
                FriendId: $(this).parent().attr("friendId"),
                response: response
            },
            success: function(json){
                $("#enterFriend form").show();
                $("#enterFriend").hide(); 
                $("#popUp").hide(); 
                $("#blackScreenofDeath").hide(); 
                $("#foundFriend").hide(); 
                updateFriendsList();
            }
    });

    $(this).parent().remove();
}

function updateEventRequest(){
    var going;
    if($(this).attr("title") === "Yes"){
        going=1;

    }
    else{
        going=0;
    }
    //call ajax with the value of going or not,the userid, and the eventid.
    //call function to update event list. (delete the div and get the events in time order).

    $(this).parent().remove();
}

function viewEventInformation(){
    $("#blackScreenofDeath").show();
    $("#popUp").show();
    $("#eventInformation").show();
        
}

function closeEventInformation(){
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#eventInformation").hide();
}

function viewAttendingEventInformation(){
    $("#blackScreenofDeath").show();
    $("#popUp").show();
    $("#eventInformation").show();
        
}

function updateFriendsList(){
    $("#friendList").empty();
    $("#friendAdderList").empty();

    $.ajax({url:"api/ViewFriends", success: function(json2){
        json2 = JSON.parse(json2);
        var friends = json2.FriendsList;
        for(var i = 0; i < friends.length ; i++){
            var friendId = friends[i].UserFriendId;
            $.ajax({url:"api/UserInfo/" + friendId, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
                console.log(friendInfo);
                var firstname = friendInfo[0].Firstname;
                var lastname = friendInfo[0].Lastname;
                var userId = friendInfo[0].UserId;
                var friend = "<button class='friend' type='button' friendId=" + userId + ">"+ firstname +" "+ lastname+ "</button>";
                $("#friendList").append(friend);
                var friendAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friend' title='Invite' name='invitedFriends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                $("#friendAdderList").append(friendAdder);
            }});    
        }

    }});

}