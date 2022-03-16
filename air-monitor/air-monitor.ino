#include<string.h>
#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include "FirebaseESP8266.h"


#define PM1PIN 12//DSM501A input D6 on ESP8266
#define PM25PIN 14
#define FIREBASE_HOST "airmonitor-7d236-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "foEjp2IfD2gglxcSxPHrrhNyPN1xCgqPNnJ9paxx"
#define WIFI_SSID "Wi-Fi_IoT"                                          
#define WIFI_PASSWORD "qwertyui"

byte buff[2];
unsigned long durationPM1;
unsigned long durationPM25;
unsigned long starttime;
unsigned long endtime;
unsigned long sampletime_ms = 30000;
unsigned long lowpulseoccupancyPM1 = 0;
unsigned long lowpulseoccupancyPM25 = 0;

IPAddress ip;
FirebaseData firebaseData;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");


int i=0;

String toString(const IPAddress& address) {
  return String() + address[0] + "." + address[1] + "." + address[2] + "." + address[3];
}


int getACQI( int sensor, float density ){  
  if ( sensor == 0 ) {  //PM2,5
    if ( density == 0 ) {
      return 0; 
    } else if ( density <= 15 ) {//good
      return 25 ;
    } else if ( density > 15 && density <= 30 ) {//acceptable
      return 50;
    } else if ( density > 30 && density <= 55 ) {//moderate
      return 75;
    } else if ( density > 55 && density <= 110 ) {//heavy
      return 100;
    } else {//severe
      return 150;
    }
  } else {              //PM10
    if ( density == 0 ) {
      return 0; 
    } else if ( density <= 25 ) {//good
      return 25 ;
    } else if ( density > 25 && density <= 50 ) {//acceptable
      return 50;
    } else if ( density > 50 && density <= 90 ) {//moderate
      return 75;
    } else if ( density > 90 && density <= 180 ) {//heavy
      return 100;
    } else {//severe
      return 150;
    }
  }
}


void updateDatabase()
{
  String ipString = toString(ip);
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  firebaseData.setBSSLBufferSize(1024, 1024);

  
  firebaseData.setResponseSize(1024);

  String wifiMacString = WiFi.macAddress();
  String path = "/" + wifiMacString;
  timeClient.update();
  timeClient.setTimeOffset(0);

  String jsonStr = "";

  FirebaseJson json1;

  FirebaseJsonData jsonObj;
  long timeStamp = timeClient.getEpochTime();
  json1.set("/ValuePM1",calculateConcentration(lowpulseoccupancyPM1,30));
  json1.set("/ValuePM25",calculateConcentration(lowpulseoccupancyPM25,30));
  json1.set("/IP", ipString);
  json1.set("/Timestamp", (String)timeStamp);

  Serial.println("------------------------------------");
  Serial.println("JSON Data");
  json1.toString(jsonStr, true);
  Serial.println(jsonStr);
  Serial.println("------------------------------------");

  Serial.println("------------------------------------");
  Serial.println("Set JSON test...");

  if (Firebase.push(firebaseData, path, json1))
  {
    Serial.println("PASSED");
    Serial.println("PATH: " + firebaseData.dataPath());
    Serial.println("TYPE: " + firebaseData.dataType());
    Serial.print("VALUE: ");

    Serial.println("------------------------------------");
    Serial.println();

 

  }
  else
  {
    Serial.println("FAILED");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();

  

  }

}






void setup()
{

  timeClient.begin();
  Serial.begin(9600);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  ip = WiFi.localIP();


  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  Serial.println();
 
  Serial.println("Starting please wait 30s");
  pinMode(PM1PIN,INPUT);
  pinMode(PM25PIN,INPUT);
  starttime = millis(); 
}

float calculateConcentration(long lowpulseInMicroSeconds, long durationinSeconds){
  
  float ratio = (lowpulseInMicroSeconds/1000000.0)/30.0*100.0; //Calculate the ratio
  float concentration = 0.001915 * pow(ratio,2) + 0.09522 * ratio - 0.04884;//Calculate the mg/m3
  Serial.print("lowpulseoccupancy:");
  Serial.print(lowpulseInMicroSeconds);
  Serial.print("    ratio:");
  Serial.print(ratio);
  Serial.print("    Concentration:");
  Serial.println(concentration);
  return concentration;
}

void loop()
{

  timeClient.update();
  
  durationPM1 = pulseIn(PM1PIN, LOW);
  durationPM25 = pulseIn(PM25PIN, LOW);
  
  lowpulseoccupancyPM1 += durationPM1;
  lowpulseoccupancyPM25 += durationPM25;
  
  endtime = millis();
  if ((endtime-starttime) > sampletime_ms) //Only after 30s has passed we calcualte the ratio
  {
    /*
    ratio1 = (lowpulseoccupancy/1000000.0)/30.0*100.0; //Calculate the ratio
    Serial.print("ratio1: ");
    Serial.println(ratio1);
    
    concentration = 0.001915 * pow(ratio1,2) + 0.09522 * ratio1 - 0.04884;//Calculate the mg/m3
    */
    float conPM1 = calculateConcentration(lowpulseoccupancyPM1,30);
    float conPM25 = calculateConcentration(lowpulseoccupancyPM25,30);
    int AQIPM1 = getACQI(1,conPM1);
    int AQIPM25 = getACQI(0,conPM25);
    Serial.print("PM1 ");
    Serial.print(conPM1);
    Serial.print("  PM25 ");
    Serial.println(conPM25);
    Serial.print("AQIPM1 ");
    Serial.print(AQIPM1);
    Serial.print("  AQIPM25 ");
    Serial.println(AQIPM25);
    switch (AQIPM1) {
      case 25: 
         Serial.println("GOOD PM1");
        break;
      case 50:
        Serial.println("ACCEPTABLE PM1");
        break;
      case 75:
        Serial.println("MODERATE PM1");
        break;
      case 100:
        Serial.println("HEAVY PM1");
        break;         
      default:
        Serial.println("SEVERE PM1");
      }

      switch (AQIPM25) {
      case 25: 
         Serial.println("GOOD PM25");
        break;
      case 50:
        Serial.println("ACCEPTABLE PM25");
        break;
      case 75:
        Serial.println("MODERATE PM25");
        break;
      case 100:
        Serial.println("HEAVY PM25");
        break;         
      default:
        Serial.println("SEVERE PM25");
      }
  
    lowpulseoccupancyPM1 = 0;
    lowpulseoccupancyPM25 = 0;
    starttime = millis();

    updateDatabase();
  } 
}
