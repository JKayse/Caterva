
$(document).ready(function() {
    $("header").load("header.html");

    $(document).on('submit', "#signUpform", signUp);
});



function signUp(event){
    event.preventDefault();
    var password = $("#password").val();
    var cpassword = $("#confirmPassword").val();

    if(password !== cpassword){
        alert("Passwords do not match. Try again.");
        return;
    }
    else{
        /*$.ajax({
            type: "POST",
            url: "api/Users",
            data: {
                firstname: $("#firstName").val(),
                lastname: $("#lastName").val(),
                username: $("#username").val(),
                email: $("#email").val(),
                password: $("#password").val()
            },
            success:function(json){
                if(json === "error_username"){
                    alert("This username already exists.");
                    return;
                }
                if(json === "error_email"){
                    alert("This email already exists.");
                    return;
                }

                $.ajax({
                    type: "POST",
                    url: "api/Login",
                    data: {
                        email: $("#username").val(),
                        password: $("#password").val()
                    },
                    success: function(json){
                       window.location = "main.html";                       
                    }
            });
            $("#firstName").val("");
            $("#lastName").val("");
            $("#username").val("");
            $("#email").val("");
            $("#password").val("");
            $("#confirmPassword").val(""); 
           
        }});*/
    }
}