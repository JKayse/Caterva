
$(document).ready(function() {
    $("header").load("header.html");

    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            
        }
        else{
            window.location = "index.html";
        }
    }});

});