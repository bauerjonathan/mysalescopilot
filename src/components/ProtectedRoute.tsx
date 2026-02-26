import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { TIERS } from "@/config/tiers";
import { UpgradeBanner } from "@/components/UpgradeBanner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, subscription, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (searchParams.get("checkout") === "success" && subscription.tier !== "unlimited" && !subscription.loading) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          checkSubscription();
        }, 3000);
      }
    }

    if (subscription.tier === "unlimited" && searchParams.get("checkout") === "success") {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      setSearchParams({}, { replace: true });
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [searchParams, subscription.tier, subscription.loading, checkSubscription, setSearchParams]);

  if (loading || subscription.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (searchParams.get("checkout") === "success" && subscription.tier !== "unlimited") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Zahlung wird überprüft…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Free users with exceeded minutes see upgrade banner
  const isLimitReached = subscription.tier === "free" && subscription.minutesUsed >= subscription.minutesLimit;

  return (
    <>
      {isLimitReached && <UpgradeBanner />}
      {children}
    </>
  );
}
