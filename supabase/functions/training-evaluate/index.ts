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
    const { transcript, difficulty, scenario } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const transcriptText = transcript
      .map((t: { role: string; content: string }) =>
        `${t.role === "user" ? "Verkäufer" : "Kunde"}: ${t.content}`
      )
      .join("\n");

    const systemPrompt = `Du bist ein erfahrener Sales-Coach. Analysiere das folgende Verkaufsgespräch und bewerte die Leistung des Verkäufers.

KONTEXT:
- Schwierigkeitsgrad: ${difficulty === "easy" ? "Einfach (freundlicher Kunde)" : difficulty === "medium" ? "Mittel (skeptischer Kunde)" : "Schwer (abweisender Kunde)"}
- Szenario: ${scenario === "cold-call" ? "Kaltakquise" : scenario === "consulting" ? "Beratungsgespräch" : "Follow-up"}

Bewerte nach diesen Kategorien und gib jeweils einen Score von 1-100:

Du MUSST exakt dieses JSON-Format zurückgeben, NICHTS anderes:
{
  "overall_score": <1-100>,
  "categories": {
    "opening": { "score": <1-100>, "feedback": "<1-2 Sätze>" },
    "needs_analysis": { "score": <1-100>, "feedback": "<1-2 Sätze>" },
    "argumentation": { "score": <1-100>, "feedback": "<1-2 Sätze>" },
    "objection_handling": { "score": <1-100>, "feedback": "<1-2 Sätze>" },
    "closing": { "score": <1-100>, "feedback": "<1-2 Sätze>" }
  },
  "strengths": ["<Stärke 1>", "<Stärke 2>"],
  "improvements": ["<Verbesserung 1>", "<Verbesserung 2>", "<Verbesserung 3>"],
  "tip": "<Ein konkreter, actionabler Tipp für das nächste Gespräch>"
}`;

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
          { role: "user", content: `GESPRÄCHSVERLAUF:\n${transcriptText}\n\nBewerte jetzt dieses Gespräch:` },
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit erreicht." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits aufgebraucht." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse evaluation");

    const evaluation = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Evaluation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
