
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


    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            
        }
        else{
            window.location = "index.html";
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
                var friend = "<div class='friendie' friendId=" + userId+ "><img src='img/close2.png' class='deleteFriend' alt='Delete' title='Delete'><h3>" + firstname +" "+ lastname + "</h3></div>";
                $("#friendList").append(friend);
                var friendAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friend' title='Add Friend' name='Add Friends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                $("#listOfFriends").append(friendAdder);
            }});    
        }

    }});


    $.ajax({url:"api/Groups", success: function(json2){
        json2 = JSON.parse(json2);
        var groups = json2.Groups;
        for(var i = 0; i < groups.length ; i++){
            var groupItem = groups[i].Group;
            var friends = groups[i].Users;

            var groupName = groupItem.GroupName;
            var groupId = groupItem.GroupId;

            friendIdList="";

            for(var j = 0; j < friends.length ; j++){
                friendId = friends[j].UserId;
                friendIdList = friendIdList + ", " + friendId;
            }

            friendIdList = friendIdList.substring(2);
            var group = "<div class='groupie' groupId=" + groupId + " friendIds= '" + friendIdList + "'><img src='img/close2.png' class='deleteGroup' alt='Delete' title='Delete'><h3>" + groupName + "</h3></div>";
            console.log(group)
            $("#groupList").append(group);    
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
    

    group.name = $("#groupName").val();

    var numFriends =0;
    var friends = $(".friendList");



    for(var i = 0; i < friends.size(); i++){
        var friend = {};
        if(friends.eq(i).prop('checked') === true){
            friend.friendId = $(".friendList").eq(i).attr("friendId"); 
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

    $.ajax({
            type: "POST",
            url: "api/CreateGroup",
            data: {
                group: group
            },
            success: function(json){
                if(json === "error_groupName"){
                    alert("That name already exists. Please enter a new name.");
                }
                else{          
                    $("#blackScreenofDeath").hide();
                    $("#popUp").hide();
                    
                    $("#groupName").val("");
                    $(".friendList").prop('checked', false);
                    updateGroupList();
                }
            }
    });
}

function updateGroupList(){
    $("#groupList").empty();
    //call view groups;
}
