import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREE_MINUTES_LIMIT = 5;
const UNLIMITED_PRODUCT_ID = "prod_U3CAfkL2MndN2d";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GLADIA_API_KEY = Deno.env.get("GLADIA_API_KEY");
    if (!GLADIA_API_KEY) throw new Error("GLADIA_API_KEY is not configured");

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

    // Determine tier: check Stripe for unlimited, otherwise free
    let limit = FREE_MINUTES_LIMIT;
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length > 0) {
      const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "active", limit: 1 });
      let sub = subs.data[0];
      if (!sub) {
        const trialSubs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "trialing", limit: 1 });
        sub = trialSubs.data[0];
      }
      if (sub) {
        const productId = sub.items.data[0]?.price?.product as string;
        if (productId === UNLIMITED_PRODUCT_ID) {
          limit = 999999;
        }
      }
    }

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

    // Init Gladia live session
    const response = await fetch("https://api.gladia.io/v2/live", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-gladia-key": GLADIA_API_KEY,
      },
      body: JSON.stringify({
        encoding: "wav/pcm",
        sample_rate: 16000,
        bit_depth: 16,
        channels: 2,
        model: "solaria-1",
        language_config: {
          languages: ["de"],
          code_switching: false,
        },
        messages_config: {
          receive_partial_transcripts: true,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Gladia init error:", response.status, text);
      throw new Error(`Gladia API error: ${response.status}`);
    }

    const { id, url } = await response.json();
    const remainingMinutes = Math.max(0, limit - minutesUsed);

    return new Response(JSON.stringify({ session_id: id, websocket_url: url, remaining_minutes: remainingMinutes }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Gladia session init error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
