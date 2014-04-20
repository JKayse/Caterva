
$(document).ready(function() {
    $("header").load("header.html");
    $("main img").width($("main img").height());
    $(document).on('submit', "#imageUpload", uploadImage);

    $.ajax({url:"api/LoginStatus", success: function(json){
        if(json !== 'null'){
            
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