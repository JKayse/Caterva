
$(document).ready(function() {
    $("header").load("header.html");
    $("main img").width($("main img").height());
    $(document).on('submit', "#imageUpload", uploadImage);
    $(document).on('click', "#editProfile", editProfile)

    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            populatePage();
        }
        else{
            window.location = "index.html";
        }
    }});

    $("#imgInp").change(function(){
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

function uploadImage(e){
    e.preventDefault();

    //grab all form data  
    var formData = new FormData($(this)[0]);

    $.ajax({
        url: 'api/AddPicture',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            alert("The image was successfully uploaded!");
        }
    });

}

function editProfile () {
    
}

function populatePage () {
    $.ajax({url:"api/UserInfo/" + event.ownerId, async:false, success: function(json){
                json = JSON.parse(json);
                var info = json.User;
                var firstname = info[0].Firstname;
                var lastname = info[0].Lastname;
                var userName = info[0].Username;
                var email = info[0].Email;
                var pictureName = info[0].PictureName;
                if(pictureName === null){
                    pictureName = "FlockLogo1.png";
                }
                document.getElementById('name').innerHTML = firstname + " " + lastname;
                document.getElementById('userName').innerHTML = userName;
                document.getElementById('email').innerHTML = email;
            }});
}