import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const difficultyPrompts: Record<string, string> = {
  easy: `Du bist ein freundlicher, interessierter Kunde in einem Verkaufsgespräch. Du:
- Bist grundsätzlich offen und interessiert am Produkt
- Stellst höfliche Rückfragen
- Bist leicht zu überzeugen, brauchst aber noch ein paar Informationen
- Hast eventuell kleine Bedenken (Zeitaufwand für Implementierung), die aber leicht zu entkräften sind
- Bist höflich und geduldig`,

  medium: `Du bist ein skeptischer Kunde in einem Verkaufsgespräch. Du:
- Bist nicht sofort überzeugt, brauchst gute Argumente
- Hast konkrete Einwände: "Das ist zu teuer", "Wir haben schon eine Lösung", "Ich muss das mit meinem Chef besprechen"
- Stellst kritische Fragen nach ROI, Referenzen, Implementierungszeit
- Bist professionell aber direkt
- Lässt dich überzeugen, wenn die Argumente stimmen, aber machst es dem Verkäufer nicht leicht`,

  hard: `Du bist ein sehr schwieriger, abweisender Kunde in einem Verkaufsgespräch. Du:
- Hast keine Zeit und machst das sofort klar
- Wirst schnell ungeduldig bei langen Erklärungen
- Bringst aggressive Einwände: "Nicht interessiert!", "Wir brauchen das nicht!", "Rufen Sie nicht mehr an!"
- Unterbrichst den Verkäufer
- Stellst Fallen: "Was kostet das?" und dann "Viel zu teuer!"
- Bist nur zu überzeugen, wenn der Verkäufer extrem professionell und empathisch ist
- Reagierst positiver wenn der Verkäufer dich wirklich versteht und nicht einfach sein Script abspult`,
};

const scenarioContexts: Record<string, string> = {
  "cold-call": "Dies ist ein Kaltakquise-Anruf. Du wurdest unerwartet angerufen und hast eigentlich gerade etwas anderes zu tun.",
  consulting: "Dies ist ein Beratungsgespräch. Du hast den Termin selbst vereinbart, weil du ein konkretes Problem hast.",
  "follow-up": "Dies ist ein Follow-up-Anruf. Du hattest bereits ein erstes Gespräch, aber noch keine Entscheidung getroffen.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, difficulty, scenario } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `${difficultyPrompts[difficulty] || difficultyPrompts.medium}

SZENARIO: ${scenarioContexts[scenario] || scenarioContexts["cold-call"]}

WICHTIGE REGELN:
- Antworte IMMER auf Deutsch
- Bleib in deiner Rolle als Kunde, NIEMALS als KI
- Halte dich KURZ (1-3 Sätze pro Antwort) wie in einem echten Telefonat
- Reagiere natürlich auf das, was der Verkäufer sagt
- Beginne das Gespräch mit einer kurzen Begrüßung passend zum Szenario
- Verwende KEINE Markdown-Formatierung, sprich natürlich`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit erreicht. Bitte warte kurz." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits aufgebraucht." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Training chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
