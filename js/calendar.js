var currentMonth;
var currentYear;

$(document).ready(function() {
    $("header").load("header.html");
    $(document).on('click', "#prevMonth", getPrevMonth);
    $(document).on('click', "#nextMonth", getNextMonth);

    createCalendar();

});

function createCalendar(){
    var totalNumberDays;
    var currentDay = 1 ;
    var currentDate;
    var firstDate;
    var startDay;
    var currentDayString;
    var currentMonthString;
    var current;
    var extra ="";
    var currentMonthValue;

    var tbody = $("tbody");

    var week = "<tr class='week'>";

    currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    current = currentDate.getDate();
    firstDate = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
    startDay = firstDate.getDay();


    if(currentMonth === 0){
        currentMonthString="January";
    }
    else if(currentMonth === 1){
        currentMonthString="February";
    }
    else if(currentMonth === 2){
        currentMonthString="March";
    }
    else if(currentMonth === 3){
        currentMonthString="April";   
    }
    else if(currentMonth === 4){
        currentMonthString="May";
    }
    else if(currentMonth === 5){
        currentMonthString="June";
    }
    else if(currentMonth === 6){
        currentMonthString="July";
    }
    else if(currentMonth === 7){
        currentMonthString="August";   
    }
    else if(currentMonth === 8){
        currentMonthString="September";   
    }
    else if(currentMonth === 9){
        currentMonthString="October";  
    }
    else if(currentMonth === 10){
        currentMonthString="November";  
    }
    else{
        currentMonthString="December";  
    }

    if((currentMonth === 3) || (currentMonth === 5) || (currentMonth === 8) || (currentMonth === 10)){
        totalNumberDays = 30;
    }
    else if(currentMonth === 1){
        totalNumberDays = 28;
    }
    else{
        totalNumberDays = 31;
    }

    $("#month").html(currentMonthString + " " + currentYear);

    
    currentMonthValue = currentMonth;
    currentMonthValue++;
    if(currentMonth < 10){
        currentMonthValue = "0" + currentMonthValue;
    }

    for(var i = 0; i < startDay; i++){
        week = week + "<td></td>";
    }
    for(var i = startDay; i < 7; i++){
        currentDayString = currentDay;
        if(currentDayString < 10){
            currentDayString = "0" + currentDayString;
        }
        if(currentDay === current){
            extra = "class='current'";
        }
        else{
            extra = "";
        }
        week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
        currentDay++;
    }
    week = week + "</tr>";
    tbody.append(week);
    //then append week to table.
    
    while((currentDay+6) <= totalNumberDays){
        week = "<tr class='week'>";
        for(var i = 0; i < 7; i++){
            currentDayString = currentDay;
            if(currentDayString < 10){
                currentDayString = "0" + currentDayString;
            }
            if(currentDay === current){
                extra = "class='current'";
            }
            else{
                extra = "";
            }
            week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
            currentDay++;
        }
        week = week + "</tr>";
        tbody.append(week);

    }
    var leftOver = totalNumberDays - currentDay;
    if(leftOver === -1)
    {
        return;
    }
    week = "<tr class='week'>";
    for(var i = 0; i <= leftOver; i++){
        currentDayString = currentDay;
        if(currentDayString < 10){
            currentDayString = "0" + currentDayString;
        }
        if(currentDay === current){
            extra = "class='current'";
        }
        else{
            extra = "";
        }
        week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
        currentDay++;
    }
    for(var i = leftOver; i < 6; i++){
        week = week + "<td></td>";
    }
    week = week + "</tr>";
    tbody.append(week);
}

function getNextMonth(){
    $(".week").remove();

    currentMonth++;
    var totalNumberDays;
    var currentDay = 1;
    var firstDate;
    var startDay;
    var currentDate;
    var current;
    var currentDayString;
    var currentMonthString;
    var extra ="";
    var currentMonthValue;
    var startMonth;

    currentDate = new Date();
    current = currentDate.getDate();
    startMonth = currentDate.getMonth();

    var tbody = $("tbody");

    var week = "<tr class='week'>";

    if(currentMonth === 12){
        currentMonth =0;
        currentYear++;
    }

    firstDate = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
    startDay = firstDate.getDay();


    if(currentMonth === 0){
        currentMonthString="January";
    }
    else if(currentMonth === 1){
        currentMonthString="February";
    }
    else if(currentMonth === 2){
        currentMonthString="March";
    }
    else if(currentMonth === 3){
        currentMonthString="April";   
    }
    else if(currentMonth === 4){
        currentMonthString="May";
    }
    else if(currentMonth === 5){
        currentMonthString="June";
    }
    else if(currentMonth === 6){
        currentMonthString="July";
    }
    else if(currentMonth === 7){
        currentMonthString="August";   
    }
    else if(currentMonth === 8){
        currentMonthString="September";   
    }
    else if(currentMonth === 9){
        currentMonthString="October";  
    }
    else if(currentMonth === 10){
        currentMonthString="November";  
    }
    else{
        currentMonthString="December";  
    }

    if((currentMonth === 3) || (currentMonth === 5) || (currentMonth === 8) || (currentMonth === 10)){
        totalNumberDays = 30;
    }
    else if(currentMonth === 1){
        totalNumberDays = 28;
    }
    else{
        totalNumberDays = 31;
    }

    $("#month").html(currentMonthString + " " + currentYear);

    currentMonthValue = currentMonth;
    currentMonthValue++;
    if(currentMonth < 10){
        currentMonthValue = "0" + currentMonthValue;
    }

    for(var i = 0; i < startDay; i++){
        week = week + "<td></td>";
    }
    for(var i = startDay; i < 7; i++){
        currentDayString = currentDay;
        if(currentDayString < 10){
            currentDayString = "0" + currentDayString;
        }
        if(currentDay === current && startMonth === currentMonth){
                extra = "class='current'";
        }
        else{
            extra = "";
        }
        week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
        currentDay++;
    }
    week = week + "</tr>";
    tbody.append(week);
    //then append week to table.
    
    while((currentDay+6) <= totalNumberDays){
        week = "<tr class='week'>";
        for(var i = 0; i < 7; i++){
            currentDayString = currentDay;
            if(currentDayString < 10){
                currentDayString = "0" + currentDayString;
            }
            if(currentDay === current && startMonth === currentMonth){
                extra = "class='current'";
            }
            else{
                extra = "";
            }
            week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
            currentDay++;
        }
        week = week + "</tr>";
        tbody.append(week);

    }
    var leftOver = totalNumberDays - currentDay;
    if(leftOver === -1)
    {
        return;
    }
    week = "<tr class='week'>";
    for(var i = 0; i <= leftOver; i++){
        currentDayString = currentDay;
        if(currentDayString < 10){
            currentDayString = "0" + currentDayString;
        }
        if(currentDay === current && startMonth === currentMonth){
                extra = "class='current'";
        }
        else{
            extra = "";
        }
        week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
        currentDay++;
    }
    for(var i = leftOver; i < 6; i++){
        week = week + "<td></td>";
    }
    week = week + "</tr>";
    tbody.append(week);

}

function getPrevMonth(){
    $(".week").remove();
    currentMonth--;
    var totalNumberDays;
    var currentDay = 1;
    var firstDate;
    var startDay;
    var currentDayString;
    var currentMonthString;
    var extra ="";
    var currentMonthValue;

    var tbody = $("tbody");

    var week = "<tr class='week'>";

    currentDate = new Date();
    current = currentDate.getDate();
    startMonth = currentDate.getMonth();

    if(currentMonth === -1){
        currentMonth = 11;
        currentYear--;
    }

    firstDate = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
    startDay = firstDate.getDay();


    if(currentMonth === 0){
        currentMonthString="January";
    }
    else if(currentMonth === 1){
        currentMonthString="February";
    }
    else if(currentMonth === 2){
        currentMonthString="March";
    }
    else if(currentMonth === 3){
        currentMonthString="April";   
    }
    else if(currentMonth === 4){
        currentMonthString="May";
    }
    else if(currentMonth === 5){
        currentMonthString="June";
    }
    else if(currentMonth === 6){
        currentMonthString="July";
    }
    else if(currentMonth === 7){
        currentMonthString="August";   
    }
    else if(currentMonth === 8){
        currentMonthString="September";   
    }
    else if(currentMonth === 9){
        currentMonthString="October";  
    }
    else if(currentMonth === 10){
        currentMonthString="November";  
    }
    else{
        currentMonthString="December";  
    }

    if((currentMonth === 3) || (currentMonth === 5) || (currentMonth === 8) || (currentMonth === 10)){
        totalNumberDays = 30;
    }
    else if(currentMonth === 1){
        totalNumberDays = 28;
    }
    else{
        totalNumberDays = 31;
    }

    $("#month").html(currentMonthString + " " + currentYear);

    currentMonthValue = currentMonth;
    currentMonthValue++;
    if(currentMonth < 10){
        currentMonthValue = "0" + currentMonthValue;
    }

    for(var i = 0; i < startDay; i++){
        week = week + "<td></td>";
    }
    for(var i = startDay; i < 7; i++){
        currentDayString = currentDay;
        if(currentDayString < 10){
            currentDayString = "0" + currentDayString;
        }
        if(currentDay === current && startMonth === currentMonth){
                extra = "class='current'";
        }
        else{
            extra = "";
        }
        week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
        currentDay++;
    }
    week = week + "</tr>";
    tbody.append(week);
    //then append week to table.
    
    while((currentDay+6) <= totalNumberDays){
        week = "<tr class='week'>";
        for(var i = 0; i < 7; i++){
            currentDayString = currentDay;
            if(currentDayString < 10){
                currentDayString = "0" + currentDayString;
            }
            if(currentDay === current && startMonth === currentMonth){
                extra = "class='current'";
            }
            else{
                extra = "";
            }
            week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
            currentDay++;
        }
        week = week + "</tr>";
        tbody.append(week);

    }
    var leftOver = totalNumberDays - currentDay;
    if(leftOver === -1)
    {
        return;
    }
    week = "<tr class='week'>";
    for(var i = 0; i <= leftOver; i++){
        currentDayString = currentDay;
        if(currentDayString < 10){
            currentDayString = "0" + currentDayString;
        }
        if(currentDay === current && startMonth === currentMonth){
                extra = "class='current'";
        }
        else{
            extra = "";
        }
        week = week + "<td id='" + currentMonthValue + "/" + currentDayString + "/" + currentYear + "'" + extra + "><div class='date'><h4>" + currentDay + "</h4></div><div numEvents='0' events class='eventBox'><h4></h4></div></td>";
        currentDay++;
    }
    for(var i = leftOver; i < 6; i++){
        week = week + "<td></td>";
    }
    week = week + "</tr>";
    tbody.append(week);

}