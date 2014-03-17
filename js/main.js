
$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', ".groupButton", openList);
    $(".event img").width($(".event img").height());


});


function openList(){
    $(this).toggleClass("clickedGroup");
    $(this).next().toggle();
}