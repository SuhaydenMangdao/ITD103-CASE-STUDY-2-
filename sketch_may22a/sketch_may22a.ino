#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

// Replace with your network credentials
const char* ssid = "GLOBEWIFI";
const char* password = "helloworld";

// Replace with your local server IP and port
const char* serverIP = "http://192.168.254.111:3001";



const int pirMotionPin = D2; // Entrance sensor
const int pirExitPin = D3; // Exit sensor

int pirMotionState = LOW;
int pirExitState = LOW;

unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

void setup() {
  Serial.begin(115200);
  pinMode(pirMotionPin, INPUT);
  pinMode(pirExitPin, INPUT);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize time
  configTime(28800, 0, "pool.ntp.org", "time.nist.gov"); // GMT+8 for Philippines
  while (!time(nullptr)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("Time synchronized");
}

void loop() {
  int newPirMotionState = digitalRead(pirMotionPin);
  int newPirExitState = digitalRead(pirExitPin);
  String datetime = getTime();

  // Print status and send data every 5 seconds
  if (millis() - lastTime > timerDelay) {
    lastTime = millis();
    Serial.println("Status: ");
    Serial.println("Entrance sensor: ");
    if (newPirMotionState == HIGH) {
      Serial.println("1 (motion detected) ");
    } else {
      Serial.println("0 (no motion) ");
    }
    Serial.println("Exit sensor: ");
    if (newPirExitState == HIGH) {
      Serial.print("1 (motion detected) ");
    } else {
      Serial.print("0 (no motion) ");
    }

    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;
      String url = String(serverIP) + "/addsensordata";

      http.begin(client, url);
      http.addHeader("Content-Type", "application/json");

      // Create JSON payload
      StaticJsonDocument<200> jsonDoc;
      jsonDoc["entranceCount"] = newPirMotionState;
      jsonDoc["exitCount"] = newPirExitState;
      jsonDoc["time"] = datetime;

      String postData;
      serializeJson(jsonDoc, postData);

      int httpResponseCode = http.POST(postData);

      Serial.println(url);
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("HTTP Response code: " + String(httpResponseCode));
        Serial.println("Response: " + response);
      } else {
        Serial.print("Error sending data to MongoDB. HTTP Response code: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("Error in WiFi connection");
    }
  }
}

String getTime() {
  time_t now;
  struct tm timeinfo;
  char timeString[20]; // Buffer to hold formatted time

  // Get current time
  time(&now);
  localtime_r(&now, &timeinfo);

  // Format time as MM/DD/YY/HH:MM:SS
  snprintf(timeString, sizeof(timeString), "%02d/%02d/%02d/%02d:%02d:%02d",
           timeinfo.tm_mon + 1, timeinfo.tm_mday, timeinfo.tm_year % 100,
           timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);

  return String(timeString);
}
