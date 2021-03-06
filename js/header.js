
$(document).ready(function() {

    $(document).on('submit', "#signInArea", signIn);
    $(document).on('click', "#signOut", signout);
    $(document).on('click', "header img", goToCorrectPage);
    $(document).on('click', "header h1", goToCorrectPage);
    

    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            json = JSON.parse(json);
            $("#signedIn h2").html("Welcome!");
            $("#signInUsername").val("");
            $("#signInPass").val("");
            $("#signIn").css("display", "none");
            $("#signedIn").css("display", "block");                
        }
        else{
            return;
        }
    }});

});


function goToCorrectPage(){
    $.ajax({url:"api/LoginStatus", success: function(json){
        //Check what login status returns if not logged in.
        if(json !== 'null'){
             window.location = "main.html";
        }
        else{
            window.location = "index.html";
        }
    }});  

}


function signout(event){
    event.preventDefault();
    $.ajax({
            type: "POST",
            url: "api/Logout",
            success: function(){
                window.location = "index.html";
    }});
}

function signIn(){
    event.preventDefault();
    $.ajax({
            type: "POST",
            url: "api/Login",
            data: {
                username: $("#signInUsername").val(),
                password: $("#signInPass").val()
            },
            success: function(json){
                
                if(json === 'error_username_doesnt_exists'){
                    $("#signInError").html("Username does not exist.");
                    $("#signInError").show();
                    return;
                }

                if(json === 'null'){
                    $("#signInError").html("Password is not correct.");
                    $("#signInError").show();
                    return;
                }

                else{
                    $("#signInError").html("");
                    $("#signInError").hide();
                    $("#signInUsername").val("");
                    $("#signInPass").val("");
                    window.location = "main.html";

                }

            }
    });

}