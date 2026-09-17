# AI Lead Qualification & Sales Agent

An AI-powered website chat demo that qualifies sales leads, maintains conversation context, stores lead information, and hands conversations to a human manager through Telegram when needed.

## What it demonstrates

- Website chat interface
- n8n webhook-based backend
- AI sales conversation with Google Gemini
- Session-based conversation memory
- Lead qualification and structured lead extraction
- Persistent lead data using n8n Data Tables
- Human handoff to a manager through Telegram
- Manager replies displayed back in the website chat
- Lightweight frontend with HTML, CSS, and JavaScript

## Architecture

```text
Website Chat
     |
     v
n8n Webhook
     |
     +--> Handoff check ----------------> Telegram Manager
     |
     +--> AI Sales Agent
             |
             +--> Gemini
             +--> Conversation Memory
             +--> Lead Extraction
             +--> Lead Data Table
     |
     v
Website Response
```

## Project Structure

```text
AI-Lead-Qualification-Sales-Agent/
└── AI-Lead-Qualification-Sales-Agent/
    ├── Frontend/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    │
    └── Workflow/
        └── AI Lead Qualification & Sales Agent - Portfolio.json
```

### Frontend

A lightweight browser chat UI. It creates a persistent session ID with `localStorage`, sends customer messages to n8n, and polls for manager replies every 15 seconds.

### Workflow

The n8n workflow handles AI sales conversations, session memory, lead extraction, lead persistence, and human handoff through Telegram.

## Lead Qualification Logic

The agent collects information such as:

- Service or product needed
- Business type
- Budget
- Timeline
- Requirements
- Lead status

A lead becomes `qualified` when the service, budget, and timeline are known. Otherwise it remains `not_qualified_yet`.

## Human Handoff

Customers can explicitly request a human or manager. When handoff is active:

1. The customer message is saved.
2. The manager receives the message in Telegram.
3. The manager can reply.
4. The frontend retrieves manager messages through polling.
5. The manager's reply appears in the website chat.

## Setup

### 1. Import the workflow

Import the JSON file from:

`AI-Lead-Qualification-Sales-Agent/Workflow/AI Lead Qualification & Sales Agent - Portfolio.json`

### 2. Configure credentials

Replace the portfolio placeholders with your own n8n credentials and Data Table IDs:

- Google Gemini credential
- Telegram credential
- Lead Messages Data Table
- AI Leads Data Table
- Manager Telegram Chat ID

The repository intentionally contains placeholders instead of real credentials or secrets.

### 3. Configure the frontend

Open:

`AI-Lead-Qualification-Sales-Agent/Frontend/script.js`

Replace:

```text
YOUR_N8N_WEBHOOK_URL/lead-chat-portfolio
YOUR_N8N_WEBHOOK_URL/lead-messages-portfolio
```

with the corresponding webhook URLs from your n8n instance.

### 4. Run the frontend

Open `Frontend/index.html` through a local web server or deploy the frontend to a static hosting service.

## Portfolio Notes

This project is designed as a portfolio demonstration. The n8n workflow is provided as an importable JSON file, while credentials and environment-specific IDs are intentionally excluded.

The manager-message polling mechanism is intentionally kept simple for the demo and runs every 15 seconds.

## Tech Stack

- n8n
- Google Gemini
- Telegram Bot API
- HTML
- CSS
- JavaScript
- n8n Data Tables
