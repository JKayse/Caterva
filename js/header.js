
$(document).ready(function() {

    $(document).on('submit', "#signInArea", signIn);
    $(document).on('click', "header #signedIn a", signout);
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


function signout(){
    //Doesn't properly destroy session.
    $.ajax({
            type: "POST",
            url: "api/Logout",
            success: function(){
                $("#signIn").css("display", "block");
                $("#signedIn").css("display", "none");
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
                if(json === 'null'){
                    alert("The information entered was not correct. Try Again.");
                }
                //Doesn't work if username doesn't exist in database. Look at that.
                else{
                    $("#signInUsername").val("");
                    $("#signInPass").val("");
                    window.location = "main.html";

                }

            }
    });

}