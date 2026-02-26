import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, context, latestCustomerMessage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const transcriptText = transcript
      .map((t: { speaker: string; text: string }) => `${t.speaker}: ${t.text}`)
      .join("\n");

    const systemPrompt = `Du bist ein Echtzeit-Sales-Assistent. Deine Aufgabe ist es, dem Verkäufer sofort einen kurzen, prägnanten Antwortvorschlag zu liefern, basierend auf dem Gesprächsverlauf und dem Kundenkontext.

KUNDENKONTEXT:
- Name: ${context.customerName || "Unbekannt"}
- Firma: ${context.company || "Unbekannt"}
- Branche: ${context.industry || "Unbekannt"}
- Gesprächstyp: ${context.callType}
- Produkt/Service: ${context.product || "Nicht angegeben"}
- Hinweise: ${context.notes || "Keine"}

REGELN:
- Antworte auf Deutsch
- Halte dich KURZ (max. 3-4 Sätze)
- Sei direkt und actionable
- Bei Einwänden (zu teuer, kein Bedarf, kein Interesse): Liefere eine spezifische Gegenargumentation
- Verwende keine Floskeln
- Formatiere wichtige Punkte mit **fett**
- Gib NUR den Antwortvorschlag, keine Meta-Kommentare`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `BISHERIGER GESPRÄCHSVERLAUF:\n${transcriptText}\n\nLETZTE KUNDENAUSSAGE: "${latestCustomerMessage}"\n\nGib jetzt einen Antwortvorschlag:`,
          },
        ],
        stream: true,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit erreicht. Bitte warte kurz." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits aufgebraucht." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    console.error("Suggestion error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
