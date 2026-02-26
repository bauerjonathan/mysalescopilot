import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tier limits in minutes (must match frontend config)
const TIER_LIMITS: Record<string, number> = {
  "prod_U39xCTjLLk9Qwk": 200,   // Basic
  "prod_U39xmXr3fgq0jw": 500,   // Pro
  "prod_U39yD4VzCOAXVY": 999999, // Enterprise (unlimited)
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not configured");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) throw new Error("Not authenticated");

    const user = userData.user;

    // Check subscription via Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) throw new Error("Kein aktives Abonnement");

    const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "active", limit: 1 });
    let sub = subs.data[0];
    if (!sub) {
      const trialSubs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "trialing", limit: 1 });
      sub = trialSubs.data[0];
    }
    if (!sub) throw new Error("Kein aktives Abonnement");

    const productId = sub.items.data[0]?.price?.product as string;
    const limit = TIER_LIMITS[productId] ?? 0;

    // Check usage
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const { data: usageData } = await supabaseClient
      .from("usage_tracking")
      .select("minutes_used")
      .eq("user_id", user.id)
      .eq("month", currentMonth)
      .single();

    const minutesUsed = Number(usageData?.minutes_used ?? 0);
    if (minutesUsed >= limit) {
      throw new Error("Minutenlimit erreicht. Bitte upgraden Sie Ihren Plan.");
    }

    // Get token from ElevenLabs
    const response = await fetch(
      "https://api.elevenlabs.io/v1/single-use-token/realtime_scribe",
      {
        method: "POST",
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("ElevenLabs token error:", response.status, text);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const { token: scribeToken } = await response.json();
    const remainingMinutes = Math.max(0, limit - minutesUsed);

    return new Response(JSON.stringify({ token: scribeToken, remaining_minutes: remainingMinutes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Token generation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
