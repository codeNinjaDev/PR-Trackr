//Thanks David, my loving brother who helped me on this project
document.addEventListener("deviceready", onDeviceReady, false);

var map;
        var globalLiveMinutes;
        var globalLiveSeconds;
        var mylat;
        var mylong;
        var startDate = new Date();
        var startTime;
        var intervalCounter = 0;
        var stopped = false;
        var runnning_distance = 0;
        var totalSeconds = 0;
        var totalMinutes = 0;
        $('#stop').prop('disabled', true);
        var x = navigator.geolocation;
       
       
        $("#start").on("click", function() {
            stopped = false;
            startTime = startDate.getTime();
            $("#start").prop('disabled', true);
            $('#stop').prop('disabled', false);
            $("#map").css("display", "block");
            var marker = null;
            var startMarker = null;
            var startlat;
            var startlong;
            var newPoint;
            var startPoint;
                        //alert("start");

    x.getCurrentPosition(function(position) {
                                //alert("getpos");

            mylat, startlat = position.coords.latitude;
            mylong, startlong = position.coords.longitude;
             startPoint = new google.maps.LatLng(position.coords.latitude,
                 position.coords.longitude); 
    });
            // Initialize the Google Maps API v3
         map = new google.maps.Map(document.getElementById('map'), {
         zoom: 20,
         center: startPoint,
         mapTypeId: google.maps.MapTypeId.ROADMAP
     });
        startMarker = new google.maps.Marker({
                     position: startPoint,
                     map: map
        });
       
    
         x.watchPosition(success, failure, {
             maximumAge: 100,
             timeout: 300000,
             enableHighAccuracy: true
             
         });
         
         function success(position) {
             //alert("success");
             $("#finishedDistance").text('');
             $("#finishedTime").text('');
             $("#finishedPace").text('');

             newPoint = new google.maps.LatLng(position.coords.latitude,
                 position.coords.longitude);

             if (marker) {
                 // Marker already created - Move it
                 marker.setPosition(newPoint);
             } else {
                 // Marker does not exist - Create it
                 marker = new google.maps.Marker({
                     position: newPoint,
                     map: map
                 });
             }
             mylat = position.coords.latitude;
            mylong = position.coords.longitude;
             $("#lat").text(mylat);
             $("#long").text(mylong);
             // Center the map on the new position
             map.setCenter(newPoint);
             timeInterval = setInterval(function() {
                intervalCounter = intervalCounter + 1;
                var currentTime = new Date();
                var elapsedTime = currentTime.getTime() - startTime;
                var minutes = millisToMinutes(elapsedTime);
                var seconds = millisToSec(elapsedTime);
                globalLiveMinutes = minutes;
                globalLiveSeconds = seconds;
               
                $("#stopwatch").text('Time: ' + minutes + ':' + seconds);
                 
                 /*var elapsedTime = new Date();
                 totalSeconds = elapsedTime.getTime() - startTime;
                 totalSeconds  = totalSeconds/1000;*/
                if((intervalCounter % 10) == 0) {
                    if(stopped == false) {runnning_distance = calculateDistance(startlat, startlong, mylat, mylong)/1000 + runnning_distance; 
            startlat = mylat; 
             startlong = mylong;
                            }
                var miles = runnning_distance * 1.60934;
                livePace(runnning_distance * 1.60934, minutes, seconds, "miles", "livePace")
                
                }
                 
             }, 500);
            

             $("#distancekm").text(runnning_distance + " km ");
                          $("#distancem").text(runnning_distance*1000 + " m ");
                          $("#distanceFeet").text(runnning_distance *  3280.84 + " feet ");
            
             
             
         }
          function failure(position) {
             
              alert("fail!");
          }   
          $("#stop").click(function() {
            var finishedDistance = $("#distancekm").text();
            var finishedTime = $("#stopwatch").text();
            var finishedPace = $("#livePace").text();
            console.log(finishedDistance);
            console.log(finishedTime);
            console.log(finishedPace);
            clearInterval(timeInterval);
            $("#finishedDistance").text(finishedDistance);
            $("#finishedTime").text(finishedTime);
            livePace(finishedDistance* 1.60934, globalLiveMinutes, globalLiveSeconds, "miles", "finishedPace");
            stopped = true;
            
            $("#distanceFeet").text('');
            $("#distancem").text('');
            $("#distancekm").text('');
            $("#stopwatch").text('');
            $("#livePace").text('');
            
            $('#start').prop('disabled', false);
            $("#stop").prop('disabled', true);
            var endMarker = null;
            runnning_distance = 0;
            var endPoint;
            x.getCurrentPosition(function(position) {
                
                endPoint = new google.maps.LatLng(position.coords.latitude,
                 position.coords.longitude); 
               

               
                
                
            });
            endMarker = new google.maps.Marker({
                     position: endPoint,
                     map: map
            });
             
        });        
            
            function calculateDistance(lat1, lon1, lat2, lon2) {
              var R = 6371000; // meters
              var dLat = (lat2 - lat1).toRad();
              var dLon = (lon2 - lon1).toRad(); 
              var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
              var d = R * c;
              return d;
}
            
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}
            
        function failure() {
            $("lat").text("W3C Geolocation API not supported!");
        }
         
         

        });
        function livePace(distance, minutes, seconds, unit, id) {
            var totalSecondPace = (minutes*60) + seconds;
            totalSecondPace = totalSecondPace/distance;
            completeMinPace = Math.floor(totalSecondPace / 60);

            completeSecondPace = ((totalSecondPace/60) - completeMinPace) * 60;
            completeSecondPace = completeSecondPace.toFixed(2);       
            
            if (completeMinPace >= 1 && (totalSecondPace % 60) === 0) {
                $("#" + id).text("Pace: " + completeMinPace + " minute " + unit  + " pace!");
            } else {
                $("#" + id).text("Pace: " + completeMinPace + " minute " + completeSecondPace + " second " + unit + " pace! ");
            }
        }
       
        function millisToMinutes(millis) {
  var minutes = Math.floor(millis / 60000);
  
  return minutes;
}
        function millisToSec(millis) {
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return ((seconds < 10 ? '0' : '') + seconds) ;
        }

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


             var cardHTML = '<div style="width: 100%; display:table;  text-align: center; position: relative;" class="'+id+' card mdl-card mdl-shadow--2dp through mdl-shadow--16dp"> <div class="mdl-card__title"> <h2 placeholder="PR" contenteditable="true" class="card-title md-card__title-text" style="vertical-align: middle; text-align: center; display: table-cell; width: 100%;"></h2> </div><div><h3 class="mdl-card__subtitle-text">' + distance + ' ' + global + ' ' + minTime + ':' + secTime + ' </br> ' + date + '</h3> </div><div class="mdl-card__actions"><button  id="'+id+'" style="position: absolute; bottom: 0; right: 0;" class="deleteCard mdl-button mdl-js-button mdl-button--icon"><img id="delete" class="material-icons" src="icons/delete.svg"  width="24px"/></button></div></div>';


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
        $("#geolocation").css("display", "none");
    });
    $("#calculatorLink").on("click", function() {
        trackedPR.css("display", "none");
        $("#geolocation").css("display", "none");
        $("#paceCalculator").css("display", "block");
    });
    $("#mapLink").on("click", function() {
        $.confirm({
            title: 'Warning!',
            content: 'This uses internet! If you have data this will use some!',
            confirm: function() {
                
            },
            cancel: function() {
                trackedPR.css("display", "none");
        $("#geolocation").css("display", "none");
        $("#paceCalculator").css("display", "block");
            }
        });
        trackedPR.css("display", "none");
        $("#geolocation").css("display", "block");
        $("#paceCalculator").css("display", "none");
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
                    $("#save").css("display", "inline");
                } else {
                    $("#minute-mile").text("Invalid inputs!");
                }
            } else {
                if (nullCheck === false) {

                    var statement = "You accomplished " + completeMinPace + " minute " + completeSecondPace + " second " + localUnit + " pace!";
                    $("#minute-mile").text(statement);

                    $("#save").css("display", "inline");

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
