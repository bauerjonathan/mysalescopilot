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

interface Persona {
  name: string;
  role: string;
  company: string;
}

interface CompanyProfile {
  seller_name?: string;
  company_name?: string;
  product_description?: string;
  target_audience?: string;
  pain_points?: string;
  unique_selling_points?: string;
  additional_context?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, difficulty, scenario, persona, companyProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const p = persona as Persona | undefined;
    const cp = companyProfile as CompanyProfile | undefined;

    // Build persona context
    let personaContext = "";
    if (p?.name) {
      personaContext = `\nDEINE IDENTITÄT:
- Du heißt ${p.name}
- Deine Position: ${p.role}
- Dein Unternehmen: ${p.company}
- Stelle dich bei der Begrüßung mit deinem echten Namen und deiner Position vor.`;
    }

    // Build seller/product context from company profile
    let sellerContext = "";
    if (cp?.company_name || cp?.product_description || cp?.seller_name) {
      sellerContext = "\nKONTEXT ZUM VERKÄUFER (nutze das, um realistisch zu reagieren):";
      if (cp.seller_name) sellerContext += `\n- Der Verkäufer heißt: ${cp.seller_name} – sprich ihn mit diesem Namen an!`;
      if (cp.company_name) sellerContext += `\n- Der Verkäufer arbeitet bei: ${cp.company_name}`;
      if (cp.product_description) sellerContext += `\n- Produkt/Lösung: ${cp.product_description}`;
      if (cp.target_audience) sellerContext += `\n- Zielgruppe: ${cp.target_audience}`;
      if (cp.pain_points) sellerContext += `\n- Typische Probleme, die gelöst werden: ${cp.pain_points}`;
      if (cp.unique_selling_points) sellerContext += `\n- USPs: ${cp.unique_selling_points}`;
      if (cp.additional_context) sellerContext += `\n- Zusätzlicher Kontext: ${cp.additional_context}`;
    }

    const systemPrompt = `${difficultyPrompts[difficulty] || difficultyPrompts.medium}

SZENARIO: ${scenarioContexts[scenario] || scenarioContexts["cold-call"]}
${personaContext}
${sellerContext}

WICHTIGE REGELN:
- Antworte IMMER auf Deutsch
- Bleib in deiner Rolle als Kunde, NIEMALS als KI
- Halte dich KURZ (1-3 Sätze pro Antwort) wie in einem echten Telefonat
- Reagiere natürlich auf das, was der Verkäufer sagt
- Beginne das Gespräch mit einer kurzen Begrüßung passend zum Szenario
- Verwende KEINE Markdown-Formatierung, sprich natürlich
- Verwende NIEMALS Platzhalter wie [Ihr Name], [Produktname] oder ähnliches – nutze immer die konkreten Namen und Daten aus dem Kontext oben
- Wenn dir konkrete Informationen fehlen, erfinde plausible Details anstatt Platzhalter zu verwenden`;

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
