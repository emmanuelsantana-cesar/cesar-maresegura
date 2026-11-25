// Maré Segura
// Placa: ESP32 DevKit V1 (30 pinos)
// Abra o Monitor Serial em 115200.
//
// - Servidor web: entrega o painel (pasta data) e a API /api/status
// - Botões: SELECT alterna o risco MODERADO (amarela) <-> ALTO (vermelha)

#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <LittleFS.h>

// As credenciais do Wi-Fi ficam em secrets.h, que NÃO vai para o git.
// Se ele não existir, copie secrets.example.h para secrets.h e preencha.
#if __has_include("secrets.h")
#include "secrets.h"
#else
#error "Falta o arquivo secrets.h: copie secrets.example.h para secrets.h e preencha com a sua rede Wi-Fi."
#endif

const char* ssid     = WIFI_SSID;
const char* password = WIFI_PASSWORD;

WebServer server(80);

// ---------------------------------------------------------------
// Pinos
// ---------------------------------------------------------------
const int PIN_ESQUERDA = 33;
const int PIN_DIREITA  = 32;
const int PIN_SELECT   = 25;
const int PIN_HOME     = 14;  // GPIO 35 não tem pull-up interno e ficava "apertado" sozinho

const int PIN_RELE_VERMELHA = 26;  // IN1 do módulo relé
const int PIN_RELE_AMARELA  = 27;  // IN2 do módulo relé

// O módulo relé de 2 canais aciona em nível BAIXO.
// Se o de vocês acionar em nível ALTO, inverta os dois.
const int RELE_LIGA    = LOW;
const int RELE_DESLIGA = HIGH;

// ---------------------------------------------------------------
// Botões (com debounce)
// ---------------------------------------------------------------
const int NUM_BOTOES = 4;
const int pinos[NUM_BOTOES] = {PIN_ESQUERDA, PIN_DIREITA, PIN_SELECT, PIN_HOME};
const char* nomes[NUM_BOTOES] = {"ESQUERDA", "DIREITA", "SELECT", "HOME"};

int estadoEstavel[NUM_BOTOES];
int ultimaLeitura[NUM_BOTOES];
unsigned long ultimaMudanca[NUM_BOTOES];
const unsigned long DEBOUNCE_MS = 30;

bool riscoAlto = false;

void aplicarRisco() {
  // Só uma lâmpada por vez: amarela ou vermelha, nunca verde.
  digitalWrite(PIN_RELE_VERMELHA, riscoAlto ? RELE_LIGA : RELE_DESLIGA);
  digitalWrite(PIN_RELE_AMARELA,  riscoAlto ? RELE_DESLIGA : RELE_LIGA);
  Serial.println(riscoAlto ? "Risco: ALTO (vermelha)" : "Risco: MODERADO (amarela)");
}

void configurarPinos() {
  pinMode(PIN_RELE_VERMELHA, OUTPUT);
  digitalWrite(PIN_RELE_VERMELHA, RELE_DESLIGA);
  pinMode(PIN_RELE_AMARELA, OUTPUT);
  digitalWrite(PIN_RELE_AMARELA, RELE_DESLIGA);

  for (int i = 0; i < NUM_BOTOES; i++) {
    pinMode(pinos[i], INPUT_PULLUP);  // solto = HIGH, apertado = LOW
    estadoEstavel[i] = HIGH;
    ultimaLeitura[i] = HIGH;
    ultimaMudanca[i] = 0;
  }
  aplicarRisco();
}

void lerBotoes() {
  for (int i = 0; i < NUM_BOTOES; i++) {
    int leitura = digitalRead(pinos[i]);
    if (leitura != ultimaLeitura[i]) {
      ultimaLeitura[i] = leitura;
      ultimaMudanca[i] = millis();
    }
    if (millis() - ultimaMudanca[i] > DEBOUNCE_MS && leitura != estadoEstavel[i]) {
      estadoEstavel[i] = leitura;
      if (leitura == LOW) {
        Serial.print("Botao apertado: ");
        Serial.println(nomes[i]);
        if (pinos[i] == PIN_SELECT) {
          riscoAlto = !riscoAlto;
          aplicarRisco();
        }
      }
    }
  }
}

// ---------------------------------------------------------------
// Servidor web
// ---------------------------------------------------------------

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
  String json = "{\"uptime\":" + String(millis() / 1000) +
                ",\"risco\":\"" + String(riscoAlto ? "ALTO" : "MODERADO") + "\"}";
  server.send(200, "application/json", json);
}

// ---------------------------------------------------------------

void setup() {
  Serial.begin(115200);

  // Primeiro os pinos, para as lâmpadas já começarem num estado certo
  // enquanto o Wi-Fi conecta.
  configurarPinos();

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
  lerBotoes();
  server.handleClient();
}