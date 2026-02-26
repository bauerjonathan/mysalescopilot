import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    const { minutes } = await req.json();
    if (typeof minutes !== "number" || minutes <= 0) {
      throw new Error("Invalid minutes value");
    }

    const userId = userData.user.id;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Upsert usage
    const { data: existing } = await supabaseClient
      .from("usage_tracking")
      .select("id, minutes_used")
      .eq("user_id", userId)
      .eq("month", currentMonth)
      .single();

    if (existing) {
      const newMinutes = Number(existing.minutes_used) + minutes;
      await supabaseClient
        .from("usage_tracking")
        .update({ minutes_used: newMinutes, updated_at: now.toISOString() })
        .eq("id", existing.id);
    } else {
      await supabaseClient
        .from("usage_tracking")
        .insert({ user_id: userId, month: currentMonth, minutes_used: minutes });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
