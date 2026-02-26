import { useAuth } from "@/hooks/useAuth";
import { TIERS } from "@/config/tiers";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function UpgradeBanner() {
  const { createCheckout } = useAuth();
  const unlimited = TIERS.unlimited;

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-6 py-4">
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Deine kostenlosen Test-Minuten sind aufgebraucht</p>
            <p className="text-xs text-muted-foreground">
              Upgrade auf Unlimited für unbegrenzte Gespräche – nur {unlimited.price}€/Monat
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => createCheckout(unlimited.price_id)}
        >
          Jetzt upgraden <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
