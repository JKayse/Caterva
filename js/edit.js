
$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', "#addGroup", addGroupPopUp);
    $(document).on('click', ".cancelSearch", closeGroupPopUp);
    $(document).on('submit', "#groupForm", addCreatedGroup);
    $(document).on('click', ".deleteFriend", deleteFriend);
    $(document).on('click', ".deleteGroup", deleteGroup);
    $(document).on('click', ".groupie", editGroupPopUp);
    $(document).on('click', ".cancelEdit", closeEditGroupPopUp);
    $(document).on('submit', "#groupEditForm", editGroup);
    $(document).on('click', "#blackScreenofDeath", closeEverything);

    $(document).on('click', "#finalizeDeleteFriend", submitDeleteFriend);
    $(document).on('click', "#finalizeDeleteGroup", submitDeleteGroup);
    $(document).on('click', ".cancelDeleteFriend", cancelDeleteFriend);
    $(document).on('click', ".cancelDeleteGroup", cancelDeleteGroup);

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
    
    $.ajax({url:"api/ViewFriends", async:false, success: function(json2){
        json2 = JSON.parse(json2);
        var friends = json2.FriendsList;
        for(var i = 0; i < friends.length ; i++){
            var friendId = friends[i].FriendId;
            $.ajax({url:"api/UserInfo/" + friendId, async:false, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
                var firstname = friendInfo[0].Firstname;
                var lastname = friendInfo[0].Lastname;
                var userId = friendInfo[0].UserId;
                var friend = "<div class='friendie' friendId=" + userId+ "><img src='img/close2.png' class='deleteFriend' alt='Delete' title='Delete'><h3>" + firstname +" "+ lastname + "</h3></div>";
                $("#friendList").append(friend);
                var friendAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friend' title='Add Friend' name='Add Friends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                var friendEditAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friendEdit' title='Add Friend' name='Add Friends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                $("#listOfFriends").append(friendAdder);
                $("#editedListOfFriends").append(friendEditAdder);
            }});    
        }

    }});


    $.ajax({url:"api/Groups", async:false, success: function(json2){
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
    $("#editAndCreateGroups").show();
    $("#editPopUp").hide();
}

function editGroupPopUp() {
    var groupName = $(this).children().eq(1).html();
    $('#editedGroupName').val(groupName);
    var groupId = $(this).attr("groupId");
    $('#editedGroupName').attr("editGroupId", groupId);
    $('#editedGroupName').attr("editGroupName", groupName);

    var friends = $(this).attr("friendIds");
    var friendList = friends.split(", ");

    for(var i = 0; i < friendList.length; i++)
    {
        $("#" + friendList[i] + "friendEdit").prop('checked', true);
        $("#" + friendList[i] + "friendEdit").attr("original", 1);
    }

    $("#blackScreenofDeath").show();
    $("#popUp").show();
    $("#editPopUp").show();
    $("#editAndCreateGroups").hide();
}

function closeGroupPopUp(){
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("editAndCreateGroups").hide();
    $("#createGroupError").html("");
    $("#createGroupError").hide();   
    $("#groupName").val("");
    $(".friendList").prop('checked', false);
}

function closeEditGroupPopUp(){
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#editPopUp").hide();
    $("#editGroupError").html("");
    $("#editGroupError").hide(); 
    $("#editedGroupName").val("");
    $(".friendList").prop('checked', false);

}

function addCreatedGroup(){

    event.preventDefault();
    var friendsList = [];
    var group = {}; 

    group.name = $("#groupName").val();
    if(group.name.length >= 40){
        $("#createGroupError").html("Group name must be less than 40 characters.");
        $("#createGroupError").show();
        return;
    }

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
        $("#createGroupError").html("Please add at least one friend.");
        $("#createGroupError").show();
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
                    $("#createGroupError").html("That name already exists. Try again.");
                    $("#createGroupError").show();
                }
                else{   
                    $("#createGroupError").html("");
                    $("#createGroupError").hide();       
                    $("#blackScreenofDeath").hide();
                    $("#popUp").hide();
                    $("#editAndCreateGroups").hide();
                    $("#groupName").val("");
                    $(".friendList").prop('checked', false);
                    updateGroupList();
                }
            }
    });
}

function updateGroupList(){
    $("#groupList").empty();

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
}

function deleteFriend(){
    var friendId = $(this).parent().attr("friendId");
    var friendName = $(this).next().html();
    $("#deleteFriendName").html("Are you sure you want to delete " + friendName + "?");
    $("#deleteFriendName").attr("friendId", friendId);
    $("#deleteFriendPopUp").show();
    $("#popUp").show();
    $("#blackScreenofDeath").show();


    
}

function deleteGroup(e) {
    e.stopPropagation();
    var groupId = $(this).parent().attr("groupId");
    var groupName = $(this).next().html();
    $("#deleteGroupName").html("Are you sure you want to delete the group " + groupName + "?");
    $("#deleteGroupName").attr("groupId", groupId);
    $("#deleteGroupPopUp").show();
    $("#popUp").show();
    $("#blackScreenofDeath").show();


    
}

function editGroup() {
    event.preventDefault();
    
    var editGroupId = $("#editedGroupName").attr("editGroupId");
    var editGroupName = $('#editedGroupName').attr("editGroupName");
    var groupName = $("#editedGroupName").val();
    var friendsList = $(".friendList");
    if(groupName.length >= 40){
        $("#editGroupError").html("Group name must be less than 40 characters.");
        $("#editGroupError").show();
        return;
    }

    var checkedFriends = $(".friendList:checked");
    if(checkedFriends.size() === 0){
        $("#editGroupError").html("Please add at least one friend.");
        $("#editGroupError").show();
        return;
    }


    for(var i = 0; i < friendsList.size(); i++){
        var friendId = $(".friendList").eq(i).attr("friendId");
        if(($(".friendList").eq(i).prop('checked') === true) && ($(".friendList").eq(i).attr('original') === "1")){    
        }
        else if(($(".friendList").eq(i).prop('checked') === true)){

            $.ajax({
            type: "POST",
            url: "api/AddGroupMembers",
            data: {
                userId: friendId,
                groupId: editGroupId 
            }});  
        }
        else if(($(".friendList").eq(i).prop('checked') === false) && ($(".friendList").eq(i).attr('original') === "1")){
            $(".friendList").eq(i).attr('original','0');
            $.ajax({
            type: "POST",
            url: "api/DeleteGroupMembers",
            data: {
                userId: friendId,
                groupId: editGroupId 
            }});    
        }
    }

    var stop=false;
    if(editGroupName !== groupName)
    {
        $.ajax({
            type: "POST",
            url: "api/ChangeGroupName",
            data: {
                groupname: groupName,
                groupId:  editGroupId
            },
            success: function(json){
                if(json === "error_groupName"){
                        $("#editGroupError").html("That name already exists. Try again.");
                        $("#editGroupError").show();
                        stop = true;
                }
            }
        });
    }
    if(stop === false){
        $("#blackScreenofDeath").hide();
        $("#popUp").hide();
        $("#editPopUp").hide();
        $("#groupName").val("");
        $(".friendList").prop('checked', false);
        $("#editGroupError").html("");
        $("#editGroupError").hide(); 
        updateGroupList();
    }

}

function updateFriendList() {
    $("#friendList").empty();
    $("#listOfFriends").empty();
    $("#editedListOfFriends").empty();

   $.ajax({url:"api/ViewFriends", async:false, success: function(json2){
        json2 = JSON.parse(json2);
        var friends = json2.FriendsList;
        for(var i = 0; i < friends.length ; i++){
            var friendId = friends[i].FriendId;
            $.ajax({url:"api/UserInfo/" + friendId, async:false, success: function(json){
                json = JSON.parse(json);
                var friendInfo = json.User;
                var firstname = friendInfo[0].Firstname;
                var lastname = friendInfo[0].Lastname;
                var userId = friendInfo[0].UserId;
                var friend = "<div class='friendie' friendId=" + userId+ "><img src='img/close2.png' class='deleteFriend' alt='Delete' title='Delete'><h3>" + firstname +" "+ lastname + "</h3></div>";
                $("#friendList").append(friend);
                var friendAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friend' title='Add Friend' name='Add Friends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                var friendEditAdder = "<input type='checkbox' class='friendList' friendId=" + userId + " id='" + userId + "friendEdit' title='Add Friend' name='Add Friends'><label for='" + userId + "friend'>"+ firstname +" "+ lastname + "</label><br>";
                $("#listOfFriends").append(friendAdder);
                $("#editedListOfFriends").append(friendEditAdder);
            }});    
        }

    }});
}


function closeEverything(){
    $("#editAndCreateGroups").hide();
    $("#editPopUp").hide();
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
    $("#groupName").val("");
    $(".friendList").prop('checked', false);
    $("#editedGroupName").val("");
    $(".friendList").prop('checked', false);
    $("#deleteFriendPopUp").hide();
    $("#deleteGroupPopUp").hide();
    $("#createGroupError").html("");
    $("#createGroupError").hide();   
    $("#editGroupError").html("");
    $("#editGroupError").hide(); 
}

function submitDeleteFriend(){

    $.ajax({
            type: "POST",
            url: "api/DeleteFriend", async: false,
            data: {
                friendId: $("#deleteFriendName").attr("friendId")
            },
            success:function(json){
                $("#deleteFriendPopUp").hide();
                $("#blackScreenofDeath").hide();
                $("#popUp").hide();
                updateFriendList();
            }
    });

}

function submitDeleteGroup(){

    $.ajax({
            type: "POST",
            url: "api/DeleteGroup", async: false,
            data: {
                groupId: $("#deleteGroupName").attr("groupId")
            },
            success: function(json){
                $("#deleteGroupPopUp").hide();
                $("#blackScreenofDeath").hide();
                $("#popUp").hide();
                updateGroupList();
            }
    });
}

function cancelDeleteFriend(){
    $("#deleteFriendPopUp").hide();
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
}

function cancelDeleteGroup(){
    $("#deleteGroupPopUp").hide();
    $("#blackScreenofDeath").hide();
    $("#popUp").hide();
}