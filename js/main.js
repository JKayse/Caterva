var eventList =[];
var currentEvent=0;

$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', ".groupButton", openList);
    $(".eventImage").width($(".eventImage").height());

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

    $(document).on('click', ".switch-label", toggleItem);


    $('.mouseover').slimScroll({
        height: '83%'
    });
    
    $(".mouseover").height('100%');
    $(".slimScrollRail").hide();
    $(".slimScrollBar").hide();



    /*
    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            
        }
        else{
            window.location = "index.html";
        }
    }});
*/

    $.ajax({url:"api/Events", success: function(json){
        json = JSON.parse(json);
        var events = json.Events;
        for(var i =0; i < events.length; i++){
            var event = {};
            event.eventId = events[i].EventId;
            event.ownerId = events[i].OwnerId;
            event.eventName = events[i].EventName;
            event.endTime = events[i].EndTime;
            event.startTime = events[i].StartTime;
            event.description = events[i].EventDescription;
            event.share = events[i].Share;
            eventList.push(event);
            
        }
        


    }}); 


    $.ajax({url:"api/ViewFriendRequest", success: function(json2){
        json2 = JSON.parse(json2);
        var friendRequests = json2.FriendRequest;
        for(var i = 0; i < friendRequests.length ; i++){
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

    $.ajax({url:"api/ViewFriends", success: function(json2){
        json2 = JSON.parse(json2);
        var friends = json2.FriendsList;
        for(var i = 0; i < friends.length ; i++){
            var friendId = friends[i].FriendId;
            $.ajax({url:"api/UserInfo/" + friendId, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
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

    $.ajax({url:"api/Groups", async:false, success: function(json2){
        json2 = JSON.parse(json2);
        var groups = json2.Groups;
        var friendList;
        var friendIdList;
        for(var i = 0; i < groups.length ; i++){
            var groupItem = groups[i].Group;
            var friends = groups[i].Users;


            var groupName = groupItem.GroupName;
            var groupId = groupItem.GroupId;
            var friendId;

            var group = "<button class='groupButton' type='button' groupId=" + groupId + ">" + groupName + " </button><div class='groupMembers' groupId=" + groupId + ">";
            var groupAdder = "<input type='checkbox' class='groupList' id='" + groupId + "Group' friends='";
            friendList = "";
            friendIdList = "";
            for(var j = 0; j < friends.length ; j++){
                
                friendId = friends[j].UserId;
                $.ajax({url:"api/UserInfo/" + friendId, async:false, success: function(json3){
                    json3 = JSON.parse(json3);
                    var friendInfo = json3.User;
                    var firstname = friendInfo[0].Firstname;
                    var lastname = friendInfo[0].Lastname;
                    var userId = friendInfo[0].UserId;

                    group = group + "<button class='friend' type='button' friendId=" + userId + ">" + firstname + " " + lastname + "</button>";
                    friendList = friendList + ", " + firstname + " " + lastname;
                    friendIdList = friendIdList + ", " + userId;


                }});    
            }
            group = group + "</div>";
            friendList = friendList.substring(2);
            friendIdList = friendIdList.substring(2);

            groupAdder = groupAdder + friendList + "' friendIds= '" + friendIdList + "' title ='Invite' name='invitedGroups'><label for=" + groupId + "Group'>" + groupName + "</label><br>";

            $("#groupAdderList").append(groupAdder);
            $("#groupList").append(group);
        }

    }}); 

    
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
     var invited = $(".invitedGuest");
    for(var i = 0; i < friendsList.size(); i++){
        friends:
        if($(".friendList").eq(i).prop('checked') === true){
            var friendId = $(".friendList").eq(i).attr("friendId");
            for(var j = 0; j < invited.size();j++){
                var id = invited.eq(j).attr("friendId");
                if(id === friendId ){
                    break friends;
                }
            }
            
            $("#eventGuestList").append("<span class='invitedGuest' friendId=" + friendId + "><img src='img/close.png' id='deleteInvitedGuest' alt='Uninvite this friend.' title='Uninvite friend.'><h4> "+ $(".friendList").eq(i).next().html() + "</h4></span>");
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
            groupFriendIds = $(".groupList").eq(i).attr("friendIds");
            var friends = groupFriends.split(", ");
            var friendIds = groupFriendIds.split(", ");
            var invited = $(".invitedGuest");
            
            for(var k = 0; k < friends.length; k++){
                friends:
                {
                    var friendId = $(".friendList").eq(i).attr("friendId");
                    for(var j = 0; j < invited.size();j++){
                        var id = invited.eq(j).attr("friendId");
                        if(id === friendIds[k] ){
                            break friends;
                        }
                    }
                    $("#eventGuestList").append("<span class='invitedGuest' friendId=" + friendIds[k] +"><img src='img/close.png' id='deleteInvitedGuest' alt='Uninvite this friend.' title='Uninvite friend.'><h4> "+ friends[k] + "</h4></span>");
                }
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
        var friend = {};
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

    $.ajax({
            type: "POST",
            url: "api/CreateEvent",
            data: {
                event: event
            },
            success: function(json){         
                $("#eventTitle").val("");
                $("#eventDescription").val("");
                $("#eventDate").val("");
                $("#eventDateEnd").val("");
                $("#eventTimeStart").val("");
                $("#eventTimeEnd").val("");
                $("#eventGuestList").empty();
                $("#allowShareEvent").prop('checked', false);
                //update event list.
            }
    });


}

function sendFriendRequest(){
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
            url: "api/AddFriend", asyn:false,
            data: {
                friendId: $(this).parent().attr("friendId"),
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
            var friendId = friends[i].FriendId;
            $.ajax({url:"api/UserInfo/" + friendId, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
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

}

function toggleItem(){
    $("#switch").toggleClass('switch-selection-right');
    $("#switch").toggleClass('switch-selection-left');
    $("#list").next().toggleClass('selected');
    $("#list").next().toggleClass('notSelected');
    $("#calendar").next().toggleClass('selected');
    $("#calendar").next().toggleClass('notSelected');

}