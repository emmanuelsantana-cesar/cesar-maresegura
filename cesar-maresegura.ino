// Maré Segura
// Placa: ESP32 DevKit V1 (30 pinos)
// Abra o Monitor Serial em 115200.
//
// - Servidor web: entrega o painel (pasta data) e a API /api/status
// - Lâmpadas: mostram o risco do posto deste totem
//     MODERADO = amarela, ALTO = vermelha, BAIXO = apagadas
// - Risco: virá de uma API. Enquanto ela não existe, dá para simular
//   digitando BAIXO, MODERADO ou ALTO no Monitor Serial.

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

// ---------------------------------------------------------------
// Risco do posto deste totem
// ---------------------------------------------------------------
enum Risco { BAIXO, MODERADO, ALTO };
const char* NOMES_RISCO[] = {"BAIXO", "MODERADO", "ALTO"};

// Valor de demonstração até a API de risco existir.
Risco risco = MODERADO;

void aplicarRisco() {
  // Só uma lâmpada por vez. Não há lâmpada verde: no BAIXO ficam apagadas.
  digitalWrite(PIN_RELE_VERMELHA, risco == ALTO     ? RELE_LIGA : RELE_DESLIGA);
  digitalWrite(PIN_RELE_AMARELA,  risco == MODERADO ? RELE_LIGA : RELE_DESLIGA);
  Serial.print("Risco: ");
  Serial.println(NOMES_RISCO[risco]);
}

void definirRisco(Risco novo) {
  if (novo == risco) return;
  risco = novo;
  aplicarRisco();
}

// Simula a resposta da API: digite BAIXO, MODERADO ou ALTO no Monitor Serial.
// Quando a API existir, quem chama definirRisco() é o código que busca nela.
void lerComandoSerial() {
  if (!Serial.available()) return;
  String comando = Serial.readStringUntil('\n');
  comando.trim();
  comando.toUpperCase();
  if (comando.length() == 0) return;

  for (int r = BAIXO; r <= ALTO; r++) {
    if (comando == NOMES_RISCO[r]) {
      definirRisco((Risco)r);
      return;
    }
  }
  Serial.println("Comando desconhecido. Use: BAIXO, MODERADO ou ALTO");
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
  // O index.html aponta para os arquivos do build atual (nomes mudam a cada build),
  // então o navegador nunca deve usar uma cópia antiga dele.
  server.sendHeader("Cache-Control", "no-cache");
  server.streamFile(f, "text/html");
  f.close();
}

// A "API" da placa: devolve um JSON
void handleStatus() {
  String json = "{\"uptime\":" + String(millis() / 1000) +
                ",\"risco\":\"" + String(NOMES_RISCO[risco]) + "\"}";
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
  // JS e CSS gerados pelo build do frontend (pasta data/assets, comprimidos em .gz).
  // O nome muda a cada build, então o navegador pode guardar em cache por 1 ano.
  server.serveStatic("/assets", LittleFS, "/assets", "max-age=31536000, immutable");
  server.serveStatic("/", LittleFS, "/");
  server.begin();
}

void loop() {
  lerBotoes();
  lerComandoSerial();
  server.handleClient();
}