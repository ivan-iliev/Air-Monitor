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

async function gotData(data) {
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


chartIt();

async function chartIt() {
    //   await gotData();

    const ctx = document.getElementById('myChart').getContext('2d');
    const ctx2 = document.getElementById('myLineChart').getContext('2d');


    const data = {
        labels: timestampArr,
        datasets: [{
                label: 'PM1',
                data: valuesPM1,
                borderColor: 'rgba(75, 192, 20, 0.2)',
                backgroundColor: 'rgba(75, 192, 20, 1)',
            },
            {
                label: 'PM25',
                data: valuesPM25,
                borderColor: 'rgba(75, 0, 0, 0.2)',
                backgroundColor: 'rgba(75, 0, 0, 1)',
            }
        ]
    };

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    const myLineChart = new Chart(ctx2, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: false,
                    text: 'Line'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',

                    // grid line settings
                    grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },
            }
        },
    });
}


//const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];