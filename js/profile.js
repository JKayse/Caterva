
$(document).ready(function() {
    $("header").load("header.html");
    $("main img").width($("main img").height());


    // $.ajax({url:"api/LoginStatus", success: function(json){
    //     if(json !== 'null'){
            
    //     }
    //     else{
    //         window.location = "index.html";
    //     }
    // }});

    $("#imgInp").change(function(){
            readURL(this);
    });

});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();            
        reader.onload = function (e) {
            $('#target').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}