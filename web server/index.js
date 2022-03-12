const firebaseConfig = {
    apiKey: "AIzaSyAIdXk3Ia28cgFMZISemJZMJk0bPlnxjfQ",
    authDomain: "airmonitor-7d236.firebaseapp.com",
    databaseURL: "https://airmonitor-7d236-default-rtdb.firebaseio.com",
    projectId: "airmonitor-7d236",
    storageBucket: "airmonitor-7d236.appspot.com",
    messagingSenderId: "683512512767",
    appId: "1:683512512767:web:adfcf2a3f33910983b8cca",
    measurementId: "G-HY0K01LG53"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();


var database;

database = firebase.database();
var ref = database.ref('CC:50:E3:60:EF:C1');


ref.on('value', gotData, errData);

function gotData(data) {
    console.log(data.val());
    var dataDB = data.val();
    console.log(JSON.stringify(dataDB));
    var keys = Object.keys(dataDB);
    console.log(keys);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var a = dataDB[k];
        console.log(a);
    }

}




function errData(err) {
    console.log("Err!");
    console.log(err);
}