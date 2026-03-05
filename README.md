# 🎯 SalesCopilot – AI-Powered Sales Assistant & Training Platform

## Motivation

Vertriebsteams stehen täglich vor der Herausforderung, in Echtzeit die richtigen Argumente zu finden, Einwände souverän zu behandeln und Gespräche zum Abschluss zu führen. Bestehende CRM-Tools helfen bei der Nachbereitung – aber nicht *während* des Gesprächs. SalesCopilot schließt diese Lücke: Ein KI-Assistent, der live mithört und sofort passende Antwortvorschläge liefert, kombiniert mit einem Trainingsmodul, in dem Vertriebler gegen realistische KI-Kunden üben können – branchenunabhängig und angepasst an das eigene Produkt.

## Features

- **🎙️ Echtzeit Sales Copilot** – Live-Transkription von Verkaufsgesprächen mit sofortigen KI-Antwortvorschlägen und Einwandbehandlung
- **🤖 KI Sales Training** – Simulierte Verkaufsgespräche mit adaptiven KI-Kunden-Personas in 3 Schwierigkeitsstufen
- **🏢 Firmenprofil-Integration** – Training und Vorschläge werden automatisch auf das eigene Produkt, die Zielgruppe und USPs zugeschnitten
- **🎤 Voice Chat** – Sprachbasiertes Training mit Text-to-Speech für realistische Gesprächssimulationen
- **📊 Auswertung** – Detaillierte Bewertung nach jedem Training mit Scores und konkretem Feedback

## Tech Stack

| Bereich | Technologie |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Supabase (Auth, PostgreSQL, Edge Functions) |
| **KI / LLM** | Google Gemini 2.5 Flash via Lovable AI Gateway |
| **Live-Transkription** | Gladia.io Realtime API |
| **Sprachausgabe** | ElevenLabs TTS + Web Speech API (Fallback) |
| **Payments** | Stripe (Checkout, Customer Portal) |
| **i18n** | i18next (Deutsch / Englisch) |
| **State Management** | TanStack React Query |
| **Routing** | React Router v6 |

## Architektur

```
Browser (React SPA)
  ├── Live Session ──→ Gladia.io (Transkription) ──→ Gemini (Vorschläge)
  ├── Training ──→ Gemini (KI-Kunde) ──→ ElevenLabs (TTS)
  └── Supabase (Auth, DB, Edge Functions, Stripe Webhooks)
```

## Entwicklung

```sh
# Repository klonen
git clone <YOUR_GIT_URL>

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```
