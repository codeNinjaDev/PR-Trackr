
$(document).ready(function () {
    
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
    
    var card = function(distance, global, minTime, secTime, id) {
            var cardHTML = '<div class="card mdl-card mdl-shadow--2dp through mdl-shadow--16dp"> <div class="mdl-card__title"> <h2 placeholder="PR" contenteditable="true" id="'+id+'" class="card-title md-card__title-text"></h2> <br/><h3 class="mdl-card__subtitle-text">' + distance + ' ' + global + '<br />' + minTime + ':' + secTime + '</h3> <h4 class="mdl-card__supporting-text"> </div></div>';
        
            
            document.getElementById('storage').innerHTML += cardHTML;
            
            var trackedPRs = $("#storage").html();
            
            
            
            /*trackedPR.append(cardAppend);*/
            storage.setItem("trackedPRs", JSON.stringify(trackedPRs));
        
    };
    
    
    

        
    
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
        if (distance === "" || seconds === 0) {
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
            
            completeSecondPace = totalSecondPace % 60;
            
            completeSecondPace = completeSecondPace.toFixed(1);
            completeMinPace = Math.floor(totalSecondPace / 60);
            
            if (completeMinPace % 1 === 0 && secondTime === 0) {

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
            
            
            var jsonCard = JSON.stringify({ "distance": rawDistance, "global": globalUnit, "timeMinutes": minute, "timeSeconds": secondTime, "id": i});
            
            
            
            
            
            storage.setItem(('cardObject' + i), jsonCard);
            
            var cardData = localStorage.getItem(('cardObject' + i));
            
            
            card(JSON.parse(cardData).distance, JSON.parse(cardData).global, JSON.parse(cardData).timeMinutes, JSON.parse(cardData).timeSeconds, JSON.parse(cardData).id);
            
            
            
            
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
    
    $("#saveTitle").on('click', function(){
        var storedPRs = $("#storage").html();
        console.log(storedPRs);
        storage.setItem("trackedPRs", JSON.stringify(storedPRs));
    });

    

    /*//Database
    //prefixes of implementation that we want to test
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    //prefixes of window.IDB objects
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

    var db;

    function indexedDBOk() {
        return "indexedDB" in window;
    }

    document.addEventListener("DOMContentLoaded", function() {

        //No support? Go in the corner and pout.
        if (!indexedDBOk) return;

        var openRequest = indexedDB.open("prTrackrStorage", 1);

        openRequest.onupgradeneeded = function(e) {
            var thisDB = e.target.result;

            if (!thisDB.objectStoreNames.contains("pr")) {
                thisDB.createObjectStore("pr", {keyPath: "id", autoincrement: true});
            }
        }

        openRequest.onsuccess = function(e) {
            console.log("running onsuccess");

            db = e.target.result;

            //Listen for add clicks
            document.querySelector("#save").addEventListener("click", addPR, false);
        }

        openRequest.onerror = function(e) {
            //Do something for the error
        }

    }, false);

    function addPR(e) {
        var distanceGlobal= document.querySelector("#distanceInput").value;
        var timeMin = document.querySelector("#minuteInput").value;
        var timeSec = document.querySelector("#secondInput").value;
        var globalUnitStorage = globalUnit;

        var transaction = db.transaction(["pr"], "readwrite");
        var store = transaction.objectStore("pr");

        //Define a person
        var pr = {
            distanceGlobal: distanceGlobal,
            timeMin: timeMin,
            timeSec: timeSec,
            globalUnitStorage: globalUnitStorage,
            created: new Date()
        }

        //Perform the add
        var request = store.add(pr, 1);
        
        request.onerror = function(e) {
            console.log("Error", e.target.error.name);
            //some type of error handler
        }

        request.onsuccess = function(e) {
            console.log("Woot! Did it");
            card(request.result.distanceGlobal, request.result.globalUnitStorage, request.result.timeMin, request.result.timeSec);
        }
    }*/
    
        
    
});
