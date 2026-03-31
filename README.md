# CHATBOT Web App

Frontend MVP con look and feel de app para el chatbot de soporte de Land.

## Objetivo

- ofrecer una interfaz de chat web ligera
- mantener toda la logica RAG en Make
- usar una route interna minima para no exponer el webhook en el navegador

## Variables

Crea un archivo `.env.local` en esta carpeta con:

```bash
MAKE_CHAT_WEBHOOK_URL=https://...tu-webhook-de-make...
```

## Uso local

```bash
npm install
npm run dev
```

## Flujo

Usuario -> `/api/chat` -> webhook de Make -> respuesta -> UI
