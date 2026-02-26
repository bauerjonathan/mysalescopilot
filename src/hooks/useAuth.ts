import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTierByProductId, TIERS, TierKey } from "@/config/tiers";
import type { User, Session } from "@supabase/supabase-js";

interface SubscriptionState {
  subscribed: boolean;
  subscriptionEnd: string | null;
  productId: string | null;
  tier: TierKey | null;
  minutesUsed: number;
  minutesLimit: number;
  loading: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    subscribed: false,
    subscriptionEnd: null,
    productId: null,
    tier: null,
    minutesUsed: 0,
    minutesLimit: 0,
    loading: true,
  });

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      const tier = data.product_id ? getTierByProductId(data.product_id) : null;
      const minutesLimit = tier ? TIERS[tier].minutes_limit : 0;
      setSubscription({
        subscribed: data.subscribed ?? false,
        subscriptionEnd: data.subscription_end ?? null,
        productId: data.product_id ?? null,
        tier,
        minutesUsed: data.minutes_used ?? 0,
        minutesLimit: minutesLimit === Infinity ? 999999 : minutesLimit,
        loading: false,
      });
    } catch {
      setSubscription((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    let initialCheckDone = false;

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          if (initialCheckDone) {
            // Only trigger on subsequent auth changes, not the initial one
            setTimeout(checkSubscription, 0);
          }
        } else {
          setSubscription({ subscribed: false, subscriptionEnd: null, productId: null, tier: null, minutesUsed: 0, minutesLimit: 0, loading: false });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        initialCheckDone = true;
        checkSubscription();
      }
    });

    return () => authSub.unsubscribe();
  }, [checkSubscription]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const createCheckout = async (priceId: string) => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId },
    });
    if (error) throw error;
    if (data?.url) window.open(data.url, "_blank");
  };

  const openCustomerPortal = async () => {
    const { data, error } = await supabase.functions.invoke("customer-portal");
    if (error) throw error;
    if (data?.url) window.open(data.url, "_blank");
  };

  return {
    user,
    session,
    loading,
    subscription,
    signUp,
    signIn,
    signOut,
    createCheckout,
    openCustomerPortal,
    checkSubscription,
  };
}
