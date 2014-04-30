
$(document).ready(function() {
    $("header").load("header.html");

    $(document).on('submit', "#signUpform", signUp);


});




function signUp(event){
    event.preventDefault();
    var password = $("#password").val();
    var cpassword = $("#confirmPassword").val();

    if(password !== cpassword){
        $("#signUpError").html("Passwords do not match. Try again.");
        $("#signUpError").show();
        return;
    }
    else{
        $.ajax({
            type: "POST",
            url: "api/Users",
            data: {
                firstname: $("#firstname").val(),
                lastname: $("#lastname").val(),
                username: $("#username").val(),
                email: $("#email").val(),
                password: $("#password").val()
            },
            success:function(json){
                if(json === "error_username"){
                    $("#signUpError").html("This username already exists.");
                    $("#signUpError").show();
                    return;
                }
                if(json === "error_email"){
                    $("#signUpError").html("This email already exists.");
                    $("#signUpError").show();
                    return;
                }

                $("#signUpError").html("");
                $("#signUpError").hide();

                $.ajax({
                    type: "POST",
                    url: "api/Login",
                    data: {
                        username: $("#username").val(),
                        password: $("#password").val()
                    },
                    success: function(json){

                       window.location = "main.html";                       
                    }
            });
            $("#firstname").val("");
            $("#lastname").val("");
            $("#username").val("");
            $("#email").val("");
            $("#password").val("");
            $("#confirmPassword").val(""); 
           
        }});
    }
}