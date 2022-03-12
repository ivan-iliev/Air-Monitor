let timestampArr = [];
let valuesPM1 = [];
let valuesPM25 = [];

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
        var valuePM1 = dataDB[k].ValuePM1;
        var valuePM25 = dataDB[k].ValuePM25;
        var timestamp = dataDB[k].Timestamp;

        var date = new Date(timestamp * 1000);

        var time = date.toDateString() + " " + date.toLocaleTimeString();
        // console.log(a);
        // console.log(valuePM1);
        // console.log(valuePM25);

        timestampArr.push(time);
        valuesPM1.push(valuePM1);
        valuesPM25.push(valuePM25);
    }

}




function errData(err) {
    console.log("Err!");
    console.log(err);
}


console.log(valuesPM1);
console.log(valuesPM25);
console.log(timestampArr);


const ctx = document.getElementById('myChart').getContext('2d');

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

//const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

const data = {
    labels: timestampArr,
    datasets: [{
            label: 'PM1',
            data: valuesPM1,
            borderColor: 'rgba(75, 192, 20, 0.2)',
            backgroundColor: 'rgba(75, 192, 20, 1)',
        },
        {
            label: 'PM2',
            data: valuesPM25,
            borderColor: 'rgba(75, 192, 20, 0.2)',
            backgroundColor: 'rgba(75, 192, 20, 1)',
        }
    ]
};

const myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});