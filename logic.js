//Initialize firebase

var config = {
    apiKey: "AIzaSyBPbXqO3agb_ufDF24pNMK9edWCqIJlSxY",
    authDomain: "train-scheduler-deployed.firebaseapp.com",
    databaseURL: "https://train-scheduler-deployed.firebaseio.com",
    projectId: "train-scheduler-deployed",
    storageBucket: "train-scheduler-deployed.appspot.com",
    messagingSenderId: "986215325570"
};
firebase.initializeApp(config);

var database = firebase.database();

//Button for adding trains

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency-input").val().trim();

    //creates local temporary object for holding train data
    var newTrain = {
        name: trainName,
        dest: trainDest,
        time: trainTime,
        frequency: trainFrequency
    };

    //pushes train data to the database
    database.ref().push(newTrain);

    //log to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    //alert
    alert("Train has been added")

    //clears all of the text boxes

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");



});

//add trains to the databse and a row in the html
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    //store everything in a variable
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    //log train info

    console.log(trainName);
    console.log(trainDest);
    console.log(trainTime);
    console.log(trainFrequency);


    // first train time
    var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");;
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(firstTimeConverted, "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var trainRemainder = diffTime % trainFrequency;
    console.log(trainRemainder);
    // Minutes Until Train
    var tMinutesTillTrain = trainFrequency - trainRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    //add each train's data to the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
        trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>")
});



