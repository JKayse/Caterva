var eventList =[];
var currentEvent=0;

$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', ".groupButton", openList);
    

    $(document).on('click', "#editFriends", goToEditPage);
    $(document).on('click', "#addFriend", addFriend);
    $(document).on('click', "#createEvent", addEvent);
    $(document).on('click', ".cancelSearch", cancelFriendPopUp);
    $(document).on('click', ".cancelEvent", cancelCreateEventPopUp);
    $(document).on('click', ".cancelFriends", cancelAddFriendsPopUp);
    $(document).on('click', ".cancelGroups", cancelAddGroupsPopUp);

    $(document).on('click', "#addFriendsEvent", showAddFriendsPopUp);
    $(document).on('click', "#addGroupsEvent", showAddGroupsPopUp);

    $(document).on('click', "#addFriendsEditEvent", showAddFriendsEditPopUp);
    $(document).on('click', "#addGroupsEditEvent", showAddGroupsEditPopUp);
    $(document).on('click', ".cancelEditFriends", closeFriendsEditPopUp);
    $(document).on('click', ".cancelEditGroups", closeGroupsEditPopUp);
    $(document).on('submit', "#friendEditor", addFriendstoEditEvent);
    $(document).on('submit', "#groupEditor", addGroupstoEditEvent); 
    $(document).on('submit', "#eventEditor", addEditedEvent);

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

    $(document).on('click', "#prevEvents", getPrevEvents);
    $(document).on('click', "#nextEvents", getNextEvents);

    $(document).on('click', "#editEventButton", editEventPopUp);
    //$(document).on('click', "#shareEventButton", shareEventPopUp);
    $(document).on('click', ".cancelEditEvent", closeEditEventPopUp);
    //$(document).on('click', ".cancelShareEvent", shareEventPopUp);

    
    
    


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
            console.log(events.length);
            event.eventId = events[i].EventId;
            event.ownerId = events[i].OwnerId;
            event.eventName = events[i].EventName;
            event.description = events[i].EventDescription;
            event.share = events[i].Share;
            var d = new Date(events[i].StartTime);
            var d2 = new Date(events[i].EndTime);


            $.ajax({url:"api/UserInfo/" + event.ownerId, async:false, success: function(json){
                json = JSON.parse(json);
                var info = json.User;
                var firstname = info[0].Firstname;
                var lastname = info[0].Lastname;
                event.ownerName = firstname + " " + lastname;
            }});

            var end = "";
            var end2 ="";
            var startHour = d.getHours();
            if(startHour === 0 ){
                end = "AM";
                startHour = "12"
            }
            else if(startHour < 12 ){
                end = "AM";
            }
            else if(startHour === 12 ){
                end = "PM";
            }
            else{
                startHour = startHour-12;
                end = "PM";
            }
            var endHour = d2.getHours();
            if(endHour === 0 ){
                end2 = "AM";
                endHour = "12"
            }
            else if(endHour < 12 ){
                end2 = "AM";
            }
            else if(endHour === 12 ){
                end2 = "PM";
            }
            else{
                endHour = endHour-12;
                end2 = "PM";
            }

            var month1 = d.getMonth()+1;
            var month2 = d2.getMonth()+1;
            var date1 = d.getDate();
            var date2 = d2.getDate();
            var minute1 = d.getMinutes();
            var minute2 = d2.getMinutes();

            if(month1 < 10){
                month1 = "0" + month1;
            }
            if(month2 < 10){
                month2 = "0" + month2;
            }
            if(date1 < 10){
                date1 = "0" + date1;
            }
            if(date2 < 10){
                date2 = "0" + date2;
            }
            if(minute1 < 10){
                minute1 = "0" + minute1;
            }
            if(minute2 < 10){
                minute2 = "0" + minute2;
            }
            if(startHour < 10){
                startHour = "0" + startHour;
            }
            if(endHour < 10){
                endHour = "0" + endHour;
            }


            var startDate = month1 +'/'+ date1 +'/'+ d.getFullYear();
            var endDate = month2 +'/'+ date2 +'/'+ d2.getFullYear();
            var startTime = startHour +':'+ minute1 + " " + end;
            var endTime = endHour +':'+ minute2 + " " + end2;

            event.startDate = startDate;
            event.startTime = startTime;
            event.endDate = endDate;
            event.endTime = endTime;

            eventList.push(event);
            
        }
        if(eventList.length >= 3){
            var newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[0].description+ "' startDate='" + eventList[0].startDate+ "' startTime='" + eventList[0].startTime+ "' endDate='" + eventList[0].endDate+ "' endTime='" + eventList[0].endTime+ "' share='" + eventList[0].share+ "' eventId='" + eventList[0].eventId+ "' ownerId='" + eventList[0].ownerId+ "' ><h3 class='eventTitle'>" + eventList[0].eventName + "</h3><h3 class='startDate'>" + eventList[0].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[0].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[1].description+ "' startDate='" + eventList[1].startDate+ "' startTime='" + eventList[1].startTime+ "' endDate='" + eventList[1].endDate+ "' endTime='" + eventList[1].endTime+ "' share='" + eventList[1].share+ "' eventId='" + eventList[1].eventId+ "' ownerId='" + eventList[1].ownerId+ "'><h3 class='eventTitle'>" + eventList[1].eventName + "</h3><h3 class='startDate'>" + eventList[1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[2].description+ "' startDate='" + eventList[2].startDate+ "' startTime='" + eventList[2].startTime+ "' endDate='" + eventList[2].endDate+ "' endTime='" + eventList[2].endTime+ "' share='" + eventList[2].share+ "' eventId='" + eventList[2].eventId+ "' ownerId='" + eventList[2].ownerId+ "'><h3 class='eventTitle'>" + eventList[2].eventName + "</h3><h3 class='startDate'>" + eventList[2].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[2].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length == 2){
            
            newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[0].description+ "' startDate='" + eventList[0].startDate+ "' startTime='" + eventList[0].startTime+ "' endDate='" + eventList[0].endDate+ "' endTime='" + eventList[0].endTime+ "' share='" + eventList[0].share+ "' eventId='" + eventList[0].eventId+ "' ownerId='" + eventList[0].ownerId+ "'><h3 class='eventTitle'>" + eventList[0].eventName + "</h3><h3 class='startDate'>" + eventList[0].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[0].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[1].description+ "' startDate='" + eventList[1].startDate+ "' startTime='" + eventList[1].startTime+ "' endDate='" + eventList[1].endDate+ "' endTime='" + eventList[1].endTime+ "' share='" + eventList[1].share+ "' eventId='" + eventList[1].eventId+ "' ownerId='" + eventList[1].ownerId+ "'><h3 class='eventTitle'>" + eventList[1].eventName + "</h3><h3 class='startDate'>" + eventList[1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length == 1){
            newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[0].description+ "' startDate='" + eventList[0].startDate+ "' startTime='" + eventList[0].startTime+ "' endDate='" + eventList[0].endDate+ "' endTime='" + eventList[0].endTime+ "' share='" + eventList[0].share+ "' eventId='" + eventList[0].eventId+ "' ownerId='" + eventList[0].ownerId+ "'><h3 class='eventTitle'>" + eventList[0].eventName + "</h3><h3 class='startDate'>" + eventList[0].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[0].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else{
            ;
        }
        $(".eventImage").width($(".eventImage").height());
        if(eventList.length <= 3){
            $("#nextEvents").css('opacity', '0');
            $("#nextEvents").css('cursor', 'auto');
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
                $("#friendEditorList").append(friendAdder);
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
            $("#groupEditorList").append(groupAdder);

            $("#groupList").append(group);
        }

    }}); 

    
});

function showAddFriendsPopUp(){
    $("#addFriendsOptions").show();
    $("#enterEvent").hide();
    $("#editEvent").hide();
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
    var clicked =$(this).children().eq(1);
    var description = clicked.attr('description');
    var eventName = clicked.children().eq(0).html();
    var hostedBy = clicked.children().eq(2).html();
    var start = clicked.attr('startDate') + " " + clicked.attr('startTime');
    var end = clicked.attr('endDate') + " " + clicked.attr('endTime');
    var eventId = clicked.attr('eventId');
    var userId;

    $("#eventInformation").attr('eventId', eventId);

    // $.ajax({url:"api/LoginStatus", success: function(json){
    //     userId = json.ID;
    // }});
    userId = '1';
    //will replace with the real user id later.

    var imageChosen ="";
    console.log(clicked.attr('ownerId'));
    if(clicked.attr('ownerId') === userId){
        imageChosen = "<img src='img/edit.png' class='options'  id='editEventButton' alt='Edit' title='Edit'>";
    }
    else if(clicked.attr('share') === '1'){
        imageChosen = "<img src='img/share.png' id='shareEventButton' class='options' alt='Share' title='Share'>";
    }
    $("#eventInformation").empty();
    var information = "<img src='img/close.png' class='closePopUp closeEventInformation' alt='Close' title='Close'><h2>Event Information</h2>"
    information = information + imageChosen + "<hr><h2 id='eventInfoName'>" + eventName + "</h2><br><h4 id='eventInfoHost'>" + hostedBy + "</h4><br><h4 id='eventInfoDescription'>Description: " + description + "</h4><br><h4 id='eventInfoStart'>Start: " + start + "</h4><br><h4 id='eventInfoEnd'>End: " + end + "</h4><br>"
    console.log(information);
    $("#eventInformation").append(information);
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

function getPrevEvents(){
    if(currentEvent==0){
        return;
    }

    currentEvent -= 3;
    $("#eventList").empty();
    $("#nextEvents").css('opacity', '1');
    $("#nextEvents").css('cursor', 'pointer');

        if(eventList.length - currentEvent >= 3 && currentEvent%2 === 0){
            var newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+2].description+ "' startDate='" + eventList[currentEvent+2].startDate+ "' startTime='" + eventList[currentEvent+2].startTime+ "' endDate='" + eventList[currentEvent+2].endDate+ "' endTime='" + eventList[currentEvent+2].endTime+ "' share='" + eventList[currentEvent+2].share+ "' eventId='" + eventList[currentEvent+2].eventId+ "' ownerId='" + eventList[currentEvent+2].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+2].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+2].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+2].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 2 && currentEvent%2 === 0){
            newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 1 && currentEvent%2 === 0){
            newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent >= 3 && currentEvent%2 === 1){
            var newEvent = "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+2].description+ "' startDate='" + eventList[currentEvent+2].startDate+ "' startTime='" + eventList[currentEvent+2].startTime+ "' endDate='" + eventList[currentEvent+2].endDate+ "' endTime='" + eventList[currentEvent+2].endTime+ "' share='" + eventList[currentEvent+2].share+ "' eventId='" + eventList[currentEvent+2].eventId+ "' ownerId='" + eventList[currentEvent+2].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+2].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+2].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+2].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 2 && currentEvent%2 === 1){
            newEvent = "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 1 && currentEvent%2 === 1){
            newEvent = "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else{
            ;
        }
        $(".eventImage").width($(".eventImage").height());
        if(eventList.length - currentEvent <= 3){
            $("#nextEvents").css('opacity', '0');
            $("#nextEvents").css('cursor', 'auto');
        }
        if(currentEvent >= 3){
            $("#prevEvents").css('opacity', '1');
            $("#prevEvents").css('cursor', 'pointer');
        }
        if(currentEvent == 0){
            $("#prevEvents").css('opacity', '0');
            $("#prevEvents").css('cursor', 'auto');
        }
}

function getNextEvents(){

    console.log(eventList);

    if(eventList.length - currentEvent <= 3){
        return;
    }
    currentEvent += 3;
    $("#eventList").empty();
    $("#prevEvents").css('opacity', '1');
    $("#prevEvents").css('cursor', 'pointer');

        if(eventList.length - currentEvent >= 3 && currentEvent%2 === 0){
            var newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+2].description+ "' startDate='" + eventList[currentEvent+2].startDate+ "' startTime='" + eventList[currentEvent+2].startTime+ "' endDate='" + eventList[currentEvent+2].endDate+ "' endTime='" + eventList[currentEvent+2].endTime+ "' share='" + eventList[currentEvent+2].share+ "' eventId='" + eventList[currentEvent+2].eventId+ "' ownerId='" + eventList[currentEvent+2].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+2].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+2].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+2].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 2 && currentEvent%2 === 0){
            newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 1 && currentEvent%2 === 0){
            newEvent = "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent >= 3 && currentEvent%2 === 1){
            var newEvent = "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+2].description+ "' startDate='" + eventList[currentEvent+2].startDate+ "' startTime='" + eventList[currentEvent+2].startTime+ "' endDate='" + eventList[currentEvent+2].endDate+ "' endTime='" + eventList[currentEvent+2].endTime+ "' share='" + eventList[currentEvent+2].share+ "' eventId='" + eventList[currentEvent+2].eventId+ "' ownerId='" + eventList[currentEvent+2].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+2].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+2].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+2].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 2 && currentEvent%2 === 1){
            newEvent = "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            newEvent = newEvent + "<div class='event left'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent+1].description+ "' startDate='" + eventList[currentEvent+1].startDate+ "' startTime='" + eventList[currentEvent+1].startTime+ "' endDate='" + eventList[currentEvent+1].endDate+ "' endTime='" + eventList[currentEvent+1].endTime+ "' share='" + eventList[currentEvent+1].share+ "' eventId='" + eventList[currentEvent+1].eventId+ "' ownerId='" + eventList[currentEvent+1].ownerId+ "'><h3 class='eventTitle'>" + eventList[currentEvent+1].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent+1].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent+1].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else if(eventList.length - currentEvent == 1 && currentEvent%2 === 1){
            newEvent = "<div class='event right'><img src='img/FlockLogo1.png' alt='Flock Logo' title='Flock' class='eventImage'><div class='eventInfo' description='" + eventList[currentEvent].description+ "' startDate='" + eventList[currentEvent].startDate+ "' startTime='" + eventList[currentEvent].startTime+ "' endDate='" + eventList[currentEvent].endDate+ "' endTime='" + eventList[currentEvent].endTime+ "' share='" + eventList[currentEvent].share+ "' eventId='" + eventList[currentEvent].eventId+ "' ownerId='" + eventList[currentEvent].ownerId+ "' ><h3 class='eventTitle'>" + eventList[currentEvent].eventName + "</h3><h3 class='startDate'>" + eventList[currentEvent].startDate + "</h3><p class='hostedBy'>Hosted by: " + eventList[currentEvent].ownerName + "</p><button class='cancelThisEvent' type='button'>Cancel Event</button></div></div>";
            $("#eventList").append(newEvent);
        }
        else{
            ;
        }
        $(".eventImage").width($(".eventImage").height());
        if(eventList.length - currentEvent <= 3){
            $("#nextEvents").css('opacity', '0');
            $("#nextEvents").css('cursor', 'auto');
        }


}

function editEventPopUp(){
    $('#editEvent').show();
    $('#eventInformation').hide();


    var description = $("#eventInfoDescription").html();
    description = description.substring(13);

    $("#editTitle").html("Title: " + $("#eventInfoName").html());
    $("#editStart").html($("#eventInfoStart").html());
    $("#editEnd").html($("#eventInfoEnd").html());
    $("#editDescription").val(description);

}

function shareEventPopUp(){
    
}

function closeEditEventPopUp(){
    $("#eventInformation").show();
    $("#editEvent").hide();
}


function showAddFriendsEditPopUp(){
    $("#editFriendsOptions").show();
    $("#editEvent").hide();
}

function showAddGroupsEditPopUp(){
    $("#editGroupsOptions").show();
    $("#editEvent").hide();
}

function closeFriendsEditPopUp(){
    $("#editFriendsOptions").hide();
    $("#editEvent").show();
    $(".friendList").prop('checked', false);
}

function closeGroupsEditPopUp(){
    $("#editGroupsOptions").hide();
    $("#editEvent").show();
    $(".groupList").prop('checked', false);
}

function addFriendstoEditEvent(event){
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
            
            $("#editGuestList").append("<span class='invitedGuest' friendId=" + friendId + "><img src='img/close.png' id='deleteInvitedGuest' alt='Uninvite this friend.' title='Uninvite friend.'><h4> "+ $(".friendList").eq(i).next().html() + "</h4></span>");
        }
    }   
    $("#editFriendsOptions").hide();
    $("#editEvent").show();
    $(".friendList").prop('checked', false);
}


function addGroupstoEditEvent(event){
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
                    $("#editGuestList").append("<span class='invitedGuest' friendId=" + friendIds[k] +"><img src='img/close.png' id='deleteInvitedGuest' alt='Uninvite this friend.' title='Uninvite friend.'><h4> "+ friends[k] + "</h4></span>");
                }
            }
       }    
    }
       
    $("#editGroupsOptions").hide();
    $("#editEvent").show();
    $(".groupList").prop('checked', false);
}

function addEditedEvent(event){
    event.preventDefault();
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#editEvent").hide();

    var invitedList = [];
    var event = {};
    var friend = {};

    event.eventId = $("#eventInformation").attr('eventId');
    event.description = $("#editDescription").val();
    
    var invited = $(".invitedGuest");
    for(var i = 0; i < invited.size(); i++){
        var friend = {};
        friend.friendId = invited.eq(i).attr("friendId");
        invitedList.push(friend);
    }   
    event.invited = invitedList; 

    event = JSON.stringify(event);

    /*$.ajax({
            type: "POST",
            url: "api/EditEvent",
            data: {
                event: event
            },
            success: function(json){     
                $("#editDescription").val("");
                $("#editGuestList").empty();
                //update event list.
            }
    });*/
}