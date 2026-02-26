import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock, LogOut } from "lucide-react";
import { TIERS } from "@/config/tiers";
import { Check, ArrowRight } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, subscription, createCheckout, signOut, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // After checkout success, poll for subscription until it's active
  useEffect(() => {
    if (searchParams.get("checkout") === "success" && !subscription.subscribed && !subscription.loading) {
      // Start polling every 3 seconds
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          checkSubscription();
        }, 3000);
      }
    }

    if (subscription.subscribed && searchParams.get("checkout") === "success") {
      // Clear polling and remove query param
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
  }, [searchParams, subscription.subscribed, subscription.loading, checkSubscription, setSearchParams]);

  if (loading || subscription.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (searchParams.get("checkout") === "success" && !subscription.subscribed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Zahlung wird überprüft…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!subscription.subscribed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Plan auswählen</h2>
            <p className="text-muted-foreground mt-2">
              Wähle den passenden Plan für deine Anforderungen.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(Object.entries(TIERS) as [string, typeof TIERS[keyof typeof TIERS]][]).map(([key, tier]) => (
              <Card
                key={key}
                className={`relative overflow-hidden ${key === "pro" ? "border-primary/50 shadow-lg shadow-primary/10" : "border-border/50"}`}
              >
                {key === "pro" && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription>
                    {tier.minutes_limit === Infinity ? "Unbegrenzte" : `${tier.minutes_limit}`} Minuten/Monat
                  </CardDescription>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">{tier.price}€</span>
                    <span className="text-sm text-muted-foreground">/Monat</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full gap-1.5"
                    variant={key === "pro" ? "default" : "outline"}
                    onClick={() => createCheckout(tier.price_id)}
                  >
                    Jetzt starten <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="ghost" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Eingeloggt als {user.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
