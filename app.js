// CSUN campus locations with bounding rectangles
var locations = [
    {
        name: "Addie Klotz Student Health Center",
        center: { lat: 34.238006, lng: -118.526310 },
        bounds: {
            north: 34.23850,
            south: 34.23750,
            east: -118.52570,
            west: -118.52690
        }
    },
    {
        name: "BookStore",
        center: { lat: 34.237599, lng: -118.528617 },
        bounds: {
            north: 34.23810,
            south: 34.23710,
            east: -118.52800,
            west: -118.52920
        }
    },
    {
        name: "Bayramian Hall",
        center: { lat: 34.240409, lng: -118.531213 },
        bounds: {
            north: 34.24090,
            south: 34.23990,
            east: -118.53057,
            west: -118.53187
        }
    },
    {
        name: "Jacaranda Hall",
        center: { lat: 34.241549, lng: -118.528635 },
        bounds: {
            north: 34.24205,
            south: 34.24105,
            east: -118.52800,
            west: -118.52930
        }
    },
    {
        name: "Manzanita Hall",
        center: { lat: 34.237493, lng: -118.530210 },
        bounds: {
            north: 34.23799,
            south: 34.23699,
            east: -118.52960,
            west: -118.53080
        }
    },
    {
        name: "Citrus Hall",
        center: { lat: 34.238933, lng: -118.528021 },
        bounds: {
            north: 34.23943,
            south: 34.23843,
            east: -118.52740,
            west: -118.52860
        }
    }
];

var map;
var currentRound = 0;
var correctCount = 0;
var incorrectCount = 0;
var quizActive = true;

function initMap() {
    // Center on CSUN campus
    var csunCenter = { lat: 34.2389, lng: -118.5285 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: csunCenter,
        disableDefaultUI: true,
        gestureHandling: "none",
        keyboardShortcuts: false,
        clickableIcons: false,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Show the first question
    showQuestion();

    // Listen for double-click to guess
    map.addListener("dblclick", function (e) {
        if (!quizActive) return;

        var clickLat = e.latLng.lat();
        var clickLng = e.latLng.lng();
        var current = locations[currentRound];

        // Check if click is within the bounding box
        var isCorrect =
            clickLat >= current.bounds.south &&
            clickLat <= current.bounds.north &&
            clickLng >= current.bounds.west &&
            clickLng <= current.bounds.east;

        // Draw rectangle on the correct location
        var rectangle = new google.maps.Rectangle({
            strokeColor: isCorrect ? "#00AA00" : "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: isCorrect ? "#00AA00" : "#FF0000",
            fillOpacity: 0.3,
            map: map,
            bounds: {
                north: current.bounds.north,
                south: current.bounds.south,
                east: current.bounds.east,
                west: current.bounds.west
            }
        });

        // Update score
        if (isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }

        // Log the result in the panel
        logResult(current.name, isCorrect);

        // Move to next round
        currentRound++;

        if (currentRound >= locations.length) {
            // Quiz is over
            quizActive = false;
            showFinalScore();
        } else {
            showQuestion();
        }
    });
}

function showQuestion() {
    var questionEl = document.querySelector("#panel h2");
    questionEl.textContent = "Map Quiz. Please double click on the map the location of:";

    // Add current location name to the log area as the active question
    var logDiv = document.getElementById("quiz-log");
    var entry = document.createElement("div");
    entry.className = "quiz-entry";
    entry.id = "question-" + currentRound;

    var questionText = document.createElement("div");
    questionText.className = "quiz-question";
    questionText.textContent = "Where is the " + locations[currentRound].name + "??";
    entry.appendChild(questionText);

    logDiv.appendChild(entry);
}

function logResult(name, isCorrect) {
    var entry = document.getElementById("question-" + currentRound);

    var resultText = document.createElement("div");
    if (isCorrect) {
        resultText.className = "correct";
        resultText.textContent = "Your answer is correct!!";
    } else {
        resultText.className = "incorrect";
        resultText.textContent = "Sorry wrong location.";
    }
    entry.appendChild(resultText);
}

function showFinalScore() {
    var scoreDiv = document.getElementById("final-score");
    scoreDiv.textContent = correctCount + " Correct, " + incorrectCount + " Incorrect";
}
