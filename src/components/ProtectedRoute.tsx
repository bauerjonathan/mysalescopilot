import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock, CreditCard, LogOut } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, subscription, createCheckout, signOut } = useAuth();

  if (loading || subscription.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!subscription.subscribed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Abo erforderlich</CardTitle>
            <CardDescription>
              Um SalesCopilot zu nutzen, benötigst du ein aktives Abonnement für 25€/Monat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={createCheckout} className="w-full gap-2">
              <CreditCard className="h-4 w-4" />
              Jetzt für 25€/Monat abonnieren
            </Button>
            <Button variant="ghost" onClick={signOut} className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
            <p className="text-xs text-muted-foreground">
              Eingeloggt als {user.email}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
