import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREE_MINUTES_LIMIT = 5;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      return new Response(JSON.stringify({ subscribed: false, tier: "free", subscription_end: null, product_id: null, minutes_used: 0, minutes_limit: FREE_MINUTES_LIMIT }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    const user = userData.user;

    // Get usage for current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const { data: usageData } = await supabaseClient
      .from("usage_tracking")
      .select("minutes_used")
      .eq("user_id", user.id)
      .eq("month", currentMonth)
      .single();

    const minutesUsed = usageData?.minutes_used ?? 0;

    // Check Stripe subscription
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      // No Stripe customer = free tier
      return new Response(JSON.stringify({
        subscribed: true,
        tier: "free",
        product_id: null,
        subscription_end: null,
        minutes_used: minutesUsed,
        minutes_limit: FREE_MINUTES_LIMIT,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let sub = subscriptions.data[0];
    if (!sub) {
      const trialSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 1,
      });
      sub = trialSubs.data[0];
    }

    if (!sub) {
      // Stripe customer but no active sub = free tier
      return new Response(JSON.stringify({
        subscribed: true,
        tier: "free",
        product_id: null,
        subscription_end: null,
        minutes_used: minutesUsed,
        minutes_limit: FREE_MINUTES_LIMIT,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const productId = sub.items.data[0]?.price?.product as string;
    let subscriptionEnd: string | null = null;
    const endTs = sub.current_period_end;
    if (endTs != null) {
      const numeric = typeof endTs === "number" ? endTs : Number(endTs);
      if (!isNaN(numeric) && numeric > 0) {
        subscriptionEnd = new Date(numeric * 1000).toISOString();
      }
    }

    return new Response(
      JSON.stringify({
        subscribed: true,
        tier: "unlimited",
        subscription_end: subscriptionEnd,
        product_id: productId,
        minutes_used: minutesUsed,
        minutes_limit: 999999,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
