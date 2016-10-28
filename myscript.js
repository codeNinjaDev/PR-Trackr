//Thanks David, my loving brother who helped me on this project
document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady() {
    $(".mdl-layout__drawer-button").html('<img src="icons/menu.svg" width="24px" class="material-icons" id="menu"/>');
    "use strict";
    var storage = window.localStorage,
        nullCheck = false,
        submit = $("#submit-btn"),
        clear = $("#clear-btn"),
        globalUnit = "mile",
        i = -1,
        idArray= [10000],
        save = $("#save");
    if((storage.getItem("incrementID") == null) ||(typeof storage.getItem("incrementID") == "undefined")) {
        storage.setItem("incrementID", JSON.stringify(-1));
    } else {
        i = JSON.parse(storage.getItem("incrementID"));

    }

    var cardStorage = storage.getItem("trackedPRs");

    if(cardStorage != null) {
        cardStorage = JSON.parse(cardStorage);

        document.getElementById('storage').innerHTML += cardStorage;
    }

    var card = function(distance, global, minTime, secTime, id, date) {


            var cardHTML = '<div style="width: 90vw; display:table;  text-align: center; position: relative;" class="'+id+' card mdl-card mdl-shadow--2dp through mdl-shadow--16dp"> <div class="mdl-card__title"> <h2 placeholder="PR" contenteditable="true" class="card-title md-card__title-text" style="vertical-align: middle; text-align: center; display: table-cell; width: 70vw;"></h2> </div><div><h3 class="mdl-card__subtitle-text">' + distance + ' ' + global + ' ' + minTime + ':' + secTime + ' </br> ' + date + '</h3> </div><div class="mdl-card__actions"><button  id="'+id+'" style="position: absolute; bottom: 0; right: 0;" class="deleteCard mdl-button mdl-js-button mdl-button--icon"><img id="delete" class="material-icons" src="icons/delete.svg"  width="24px"/></button></div></div>';


            document.getElementById('storage').innerHTML += cardHTML;

            var trackedPRs = $("#storage").html();



            /*trackedPR.append(cardAppend);*/
            storage.setItem("trackedPRs", JSON.stringify(trackedPRs));

    };


    $(function() {
        $(document).swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
            if(direction === "left" || direction === "right") {
                $(".mdl-layout__drawer-button").click();
            }
        }
    });

  //Set some options later

});

    $( document ).on( 'click', '.deleteCard', function() {


        var id =this.id;

        id = JSON.stringify(id);
        var deleteCard = document.getElementById(id);

        var parent = $(this).closest('div.' + JSON.parse(id));


        parent.css("display", "none");
        parent.remove();
        //parentDiv.parentNode.removeChild(parentDiv);





        //parentCard.remove();
        storage.removeItem("cardObject" + JSON.parse(id));

        var trackedPRs = $("#storage").html();



        /*trackedPR.append(cardAppend);*/
        storage.setItem("trackedPRs", JSON.stringify(trackedPRs));


    });
    $(":radio[name=options]").change(function() {
        var unit = $(this).val();
        if (unit === "Km") {
            globalUnit = "km";
            $("#toggleLabelKmToMile").css("display", "block");
            $("#toggleLabelMileToKm").css("display", "none");
        } else if (unit === "Miles") {
            globalUnit = "mile";
            $("#toggleLabelKmToMile").css("display", "none");
            $("#toggleLabelMileToKm").css("display", "block");
        }

        $("#distanceLabel").text(unit);

    });
    var trackedPR = $("#savedPace");
    $("#storageLink").on("click", function() {
        trackedPR.css("display", "block");
        $("#paceCalculator").css("display", "none");
    });
    $("#calculatorLink").on("click", function() {
        trackedPR.css("display", "none");
        $("#paceCalculator").css("display", "block");
    });
    submit.on("click", function() {

        var completeSecondPace;
        var completeMinPace;
        var distance = $("#distanceInput").val();
        var rawDistance = distance;
        var minute = $("#minuteInput").val();

        var rawSecondTime = $("#secondInput");
        if (rawSecondTime.val() === "") {
            rawSecondTime.val(0);
        }
        var secondTime = parseInt(rawSecondTime.val());
        var seconds = 60 * minute + secondTime;

        var localUnit = globalUnit;
        var toggle1 = $("#convertKmPace");
        var toggle2 = $("#convertMilePace");
        if (distance === "" || seconds === 0 || rawSecondTime.val() > 60) {
            nullCheck = true;

        } else {
            nullCheck = false;
        }

        if (toggle1.is(":checked") && globalUnit === "km") {

            localUnit = "mile";
            distance = 0.621371 * distance;


            calculatePace(distance);


        } else if (toggle2.is(":checked") && globalUnit === "mile") {

            localUnit = "km";
            distance = 1.60934 * distance;

            calculatePace(distance);

        } else {
            calculatePace(distance);

        }

        //console.log("unit is " + localUnit + " the distance is " + distance +" the minute mile is" + minuteTime);
        //calculatePace(time, distance);

        function calculatePace(distance) {
            var totalSecondPace = seconds / distance;
            console.log(distance);
            /*HypothesiscompleteSecondPace = totalSecondPace % 60;

            */
            completeMinPace = Math.floor(totalSecondPace / 60);

            completeSecondPace = ((totalSecondPace/60) - completeMinPace) * 60;
            completeSecondPace = completeSecondPace.toFixed(2);
            if (completeMinPace >= 1 && (totalSecondPace % 60) === 0) {

                if (nullCheck === false) {
                    $("#minute-mile").text("You accomplished " + completeMinPace + " minute " + localUnit + " pace!");
                    $("#save").css("display", "inline-block");
                } else {
                    $("#minute-mile").text("Invalid inputs!");
                }
            } else {
                if (nullCheck === false) {

                    var statement = "You accomplished " + completeMinPace + " minute " + completeSecondPace + " second " + localUnit + " pace!";
                    $("#minute-mile").text(statement);

                    $("#save").css("display", "inline-block");

                } else {
                    $("#minute-mile").text("Invalid inputs!");
                }
            }

        }




        save.unbind().click(function() {
            var fullDate = new Date()
            console.log(fullDate);
            //Thu May 19 2011 17:25:38 GMT+1000 {}

            //convert month to 2 digits
            var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : (fullDate.getMonth()+1);

            var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
            console.log(currentDate);
            /*storage.setItem("distance", distance);
            storage.setItem("timeSeconds", secondTime);
            storage.setItem("timeMinutes", minute);
            storage.setItem("minPace", completeMinPace);
            storage.setItem("secPace", completeSecondPace);
            storage.setItem("local", localUnit);
            storage.setItem("global", globalUnit);*/
            save.css("display", "none");
            i++;
            if(i >= 0) {
                idArray[i] = i;

            }
            storage.setItem("incrementID", JSON.stringify(i));


            var jsonCard = JSON.stringify({ "distance": rawDistance, "global": globalUnit, "timeMinutes": minute, "timeSeconds": secondTime, "id": i, "date": currentDate});





            storage.setItem(('cardObject' + i), jsonCard);

            var cardData = localStorage.getItem(('cardObject' + i));


            card(JSON.parse(cardData).distance, JSON.parse(cardData).global, JSON.parse(cardData).timeMinutes, JSON.parse(cardData).timeSeconds, JSON.parse(cardData).id,
            JSON.parse(cardData).date);




        });

    });
    clear.on("click", function() {
        $("#distanceInput").val("");
        $("#minuteInput").val("");
        $("#secondInput").val("");
        $("#save").css("display", "none");
        $("#minute-mile").text("");

    });
    $("#clearAll").click(function() {


        $.confirm({
            title: 'Warning!',
            content: 'Are you sure you want to delete all saved PRs?',
            confirm: function() {
                localStorage.clear();
                $("#storage").html("");
                i = -1;
                storage.setItem("incrementID", JSON.stringify(i));
            },
            cancel: function() {

            }
        });

    });

    $( document ).on( 'keyup', '.card-title', function() {
        var storedPRs = $("#storage").html();


        storage.setItem("trackedPRs", JSON.stringify(storedPRs));
    });

}
