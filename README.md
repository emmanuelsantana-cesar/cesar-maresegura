# cesar-maresegura

Projeto em Arduino para a cadeira de Projetos 1.

Totem **Maré Segura**: uma ESP32 lê os botões, acende as lâmpadas de risco (relés) e serve um painel web com as condições da praia.

## Estrutura

```
cesar-maresegura/
├── cesar-maresegura.ino   ← código da placa (servidor web, botões, relés)
├── secrets.example.h      ← modelo das credenciais do Wi-Fi
├── secrets.h              ← suas credenciais (NÃO vai para o git)
├── frontend/              ← painel em React + TypeScript (Vite)
│   └── src/
│       ├── pages/         ← telas (Home, ...)
│       ├── components/    ← cada componente numa pasta: .tsx + .module.css
│       ├── mocks/         ← dados de demonstração (serão trocados por dados reais)
│       └── styles/        ← cores (tokens.css) e estilos globais
└── data/                  ← gerado pelo build do frontend (NÃO vai para o git)
```

## Primeira vez

1. **Wi-Fi:** copie `secrets.example.h` para `secrets.h` e preencha com a sua rede (2.4 GHz).
2. **Node.js:** instale o [Node.js](https://nodejs.org) (versão LTS).
3. **Dependências do frontend:**
   ```powershell
   cd frontend
   npm install
   ```

## Desenvolvendo o painel (sem gravar na placa)

```powershell
cd frontend
npm run dev
```

Abra o endereço que aparecer (ex.: `http://localhost:5173`). A página recarrega sozinha a cada arquivo salvo.
As chamadas para `/api` são repassadas para a placa em `http://esp32.local`, então ela precisa estar ligada e no mesmo Wi-Fi para os dados reais aparecerem.

Se o `esp32.local` não funcionar na sua rede, use o IP que aparece no Serial Monitor:

```powershell
$env:ESP32_URL="http://172.26.64.90"; npm run dev
```

## Gravando na placa

1. **Gerar o site:**
   ```powershell
   cd frontend
   npm run build
   ```
   Isso cria a pasta `data/` na raiz do projeto, com os arquivos já comprimidos (`.gz`).
2. **Código da placa:** abra `cesar-maresegura.ino` no Arduino IDE e clique em **Upload**.
3. **Site:** feche o Serial Monitor, aperte `Ctrl+Shift+P` → **Upload LittleFS to Pico/ESP8266/ESP32**.
4. Acesse `http://esp32.local` ou o IP que aparece no Serial Monitor (ex.: `http://172.26.64.90`).
   O `.local` depende de mDNS, que algumas redes (como a da faculdade) bloqueiam. Se não abrir, use o IP.

| Mudou...             | Faça                                  |
| -------------------- | ------------------------------------- |
| `cesar-maresegura.ino` | Upload                              |
| algo em `frontend/`  | `npm run build` + Upload LittleFS     |
| os dois              | os três passos                        |
