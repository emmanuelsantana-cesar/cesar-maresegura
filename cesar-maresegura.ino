#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <LittleFS.h>

const char* ssid     = "CLARO_F63D53";
const char* password = "JYpktqa4gm";

WebServer server(80);

// Entrega o index.html que está na flash
void handleRoot() {
  File f = LittleFS.open("/index.html", "r");
  if (!f) {
    server.send(500, "text/plain", "index.html nao encontrado");
    return;
  }
  server.streamFile(f, "text/html");
  f.close();
}

// A "API" da placa: devolve um JSON
void handleStatus() {
  String json = "{\"uptime\":" + String(millis() / 1000) + "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);

  if (!LittleFS.begin(true)) {
    Serial.println("Erro ao montar LittleFS");
    return;
  }

  WiFi.begin(ssid, password);
  Serial.print("Conectando");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado! Acesse: http://" + WiFi.localIP().toString());

  if (MDNS.begin("esp32")) {
    Serial.println("Ou acesse: http://esp32.local");
  }

  server.on("/", handleRoot);
  server.on("/api/status", handleStatus);
  server.serveStatic("/", LittleFS, "/");  // entrega style.css e script.js
  server.begin();
}

void loop() {
  server.handleClient();
}