
$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', "#addGroup", addGroupPopUp);
    $(document).on('click', ".cancelSearch", closeGroupPopUp);
    $(document).on('submit', "#groupForm", addCreatedGroup);

    $('.mouseover').slimScroll({
        height: '83%'
    });
    
    $(".mouseover").height('100%');
    $(".mouseover").width('95%');
    $(".slimScrollRail").hide();
    $(".slimScrollBar").hide();
    $(".slimScrollRail").css("right", '15px');
    $(".slimScrollBar").css("right", '15px');


    $.ajax({url:"api/ViewFriends", success: function(json2){
        json2 = JSON.parse(json2);
        var friends = json2.FriendsList;
        for(var i = 0; i < friends.length ; i++){
            var friendId = friends[i].UserFriendId;
            $.ajax({url:"api/UserInfo/" + friendId, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
                var firstname = friendInfo[0].Firstname;
                var lastname = friendInfo[0].Lastname;
                var userId = friendInfo[0].UserId;
                var friend = "<div class='friendie' friendId=" + userId+ "><img src='img/close2.png' class='deleteFriend' alt='Delete' title='Delete'><h3>" + firstname +" "+ lastname + "</h3></div>";
                $("#friendList").append(friend);
                var friendAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friend' title='Add Friend' name='Add Friends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                $("#listOfFriends").append(friendAdder);
            }});    
        }

    }});

});


function addGroupPopUp(){
    $("#blackScreenofDeath").show();
    $("#popUp").show();
}


function closeGroupPopUp(){
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();

    $("#groupName").val("");
    $(".friendList").prop('checked', false);
}


function addCreatedGroup(){

    event.preventDefault();
    var friendsList = [];
    var group = {};
    var friend = {};

    group.title = $("#groupName").val();

    var numFriends =0;
    var friends = $(".friendList");
    for(var i = 0; i < friends.size(); i++){
        if(friends.eq(i).prop('checked') === true){
            friend.friendId = friends.eq(i).attr("friendId");
            friendsList.push(friend);
            numFriends++;
        }
    }
    if(numFriends === 0){
        alert("Please add at least one friend.");
        return;
    }

    group.friends = friendsList;

    group = JSON.stringify(group);
    console.log(group);

    /*$.ajax({
            type: "POST",
            url: "api/CreateEvent",
            data: {
                Group: group;
            }
    });*/

    //When function is there, add it to the event list.

    
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    
    $("#groupName").val("");
    $(".friendList").prop('checked', false);
}