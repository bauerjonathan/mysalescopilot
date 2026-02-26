
# Echtzeit Sales Copilot

Ein Browser-basierter Sales-Assistent, der während Telefon-/VoIP-Gesprächen in Echtzeit mithört, transkribiert und KI-gestützte Antwortvorschläge liefert.

## Layout & Design
- **Zweispaltiges Live-Chat-Layout**: Links das Echtzeit-Transkript, rechts die KI-Antwortvorschläge
- **Header-Bereich** mit Session-Status (Aufnahme aktiv/pausiert), Timer und Kundeninfo-Anzeige
- **Dunkles, ablenkungsarmes Design** optimiert für den Einsatz neben anderen Anwendungen

## Seiten & Funktionen

### 1. Hauptseite: Live-Session
- **Vor dem Gespräch**: Formular zur Eingabe von Kundenkontext (Name, Firma, Branche, bisherige Interaktionen, Gesprächsziel, besondere Hinweise)
- **Start-Button** aktiviert die Echtzeit-Transkription über das Mikrofon (ElevenLabs Scribe Realtime)
- **Linke Spalte – Transkript**: Gesprochene Worte erscheinen in Echtzeit, farblich nach Sprecher unterschieden
- **Rechte Spalte – KI-Vorschläge**: Nach jeder erkannten Kundenaussage generiert die KI sofort einen Antwortvorschlag basierend auf:
  - dem bisherigen Gesprächsverlauf
  - dem vorab eingegebenen Kundenkontext
  - Einwandbehandlungs-Strategien
- **Einwandbehandlung**: Erkennt typische Einwände ("zu teuer", "kein Bedarf", "kein Interesse") und liefert spezielle Gegenargumente
- **Pause/Stop-Buttons** zum Steuern der Aufnahme

### 2. Session-Vorbereitung
- Formular für Kundeninformationen mit Feldern:
  - Kundenname, Firma, Branche
  - Gesprächstyp (Kaltakquise / Consulting / Follow-up)
  - Kontext-Notizen (Freitext für besondere Hinweise)
  - Produkt/Service, über das gesprochen wird
- Vorlagen für verschiedene Gesprächstypen (Kaltakquise, Consulting, Follow-up)

### 3. Nach dem Gespräch
- Vollständiges Transkript zum Durchlesen
- Button zum Kopieren des Transkripts

## Technische Umsetzung
- **ElevenLabs Scribe Realtime** für die Echtzeit-Spracherkennung über das Browser-Mikrofon
- **Lovable AI** (Gemini) für die Generierung der Antwortvorschläge mit Streaming
- Edge Functions für sichere API-Kommunikation
