
$(document).ready(function() {
    $("header").load("header.html");
    $("main img").width($("main img").height());


    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            
        }
        else{
            window.location = "index.html";
        }
    }});

});