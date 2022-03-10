// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

var firebaseRef = firebase.database().ref('info');

firebaseRef.once("value", function(snapshot) {
    var data = snapshot.val();
    for (let i in data) {
        console.log(data[i]);
    }
})