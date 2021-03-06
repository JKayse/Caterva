var currentImage;

$(document).ready(function() {
    $("header").load("header.html");
    $("main img").width($("main img").height());

    $(document).on('submit', "#imageUpload", editEverything);
    $(document).on('click', "#editProfile", editProfile);
    $(document).on('click', "#cancelChanges", cancelEdit);


    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            getQueryVariable("ID");
        }
        else{
            window.location = "index.html";
        }
    }});

    $("#chooseFile").change(function(){
            readURL(this);
    });

});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();            
        reader.onload = function (e) {
            $('main img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}



function populatePage (userId) {
    $.ajax({url:"api/UserInfo/" + userId, async:false, success: function(json){
                json = JSON.parse(json);
                var info = json.User;
                var firstname = info[0].Firstname;
                var lastname = info[0].Lastname;
                var userName = info[0].Username;
                var email = info[0].Email;
                var description = info[0].Description;
                var pictureName = info[0].PictureName;
                if(description === null){
                    description = "None"
                }
                if(pictureName === null){
                    pictureName = "FlockLogo1.png";
                }
                currentImage = pictureName;
                document.getElementById('name').innerHTML = firstname + " " + lastname + "'s Profile";
                document.getElementById('userName').innerHTML = "Username: " + userName;
                document.getElementById('email').innerHTML = "Email: " + email;
                $("#aboutMe").val(description);
                $("main img").attr("src", "img/" + pictureName);

            }});
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var pair = query.split("=");
      
    if (pair[0] == variable) {
        var profileId = pair[1];
        var properId = false;
        $.ajax({url:"api/ViewFriends", type: "POST", async:false, success: function(json2){
            json2 = JSON.parse(json2);
            var friends = json2.FriendsList;
            for(var i = 0; i < friends.length ; i++){
                var friendId = friends[i].FriendId;
                if(profileId === friendId){
                    properId = true;
                }
            }
        }}); 
        if(properId === true){
            populatePage(pair[1]);
        }
        else{
            window.location = "main.html";
        }
        
    }
    else{
        $.ajax({url:"api/LoginStatus", success: function(json){
            if(json !== 'null'){
                json = JSON.parse(json);
                userId = json.ID;
                populatePage(userId);
                $("#editProfile").show();
            }
        }});
    }
}


function editEverything(e){
    e.preventDefault();

    //grab all form data  
    var formData = new FormData($(this)[0]);

    $.ajax({
        url: 'api/AddPicture',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
    });

    var newDescription = $("#aboutMe").val();
    var newEmail = $("#email").html();
    newEmail = newEmail.substring(7);

     $.ajax({
        url: 'api/EditProfile',
        type: 'POST',
        data: {
            email: newEmail,
            description: newDescription,
        },
        success: function () {
            window.location ="profile.html";
        }
    });

}

function editProfile(){
    $("input").show();
    $("textarea").attr('disabled', false);
    $("#editProfile").hide();
}

function cancelEdit(){

    $("input").hide();
    $("#editProfile").show();
    $("textarea").attr('disabled', true);
    $("main img").attr('src', "img/" + currentImage);
}