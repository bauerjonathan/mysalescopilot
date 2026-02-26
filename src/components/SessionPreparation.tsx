import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Phone, Briefcase, RotateCcw, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { CustomerContext, CallType } from "@/types/session";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { TIERS, TierKey } from "@/config/tiers";

const TEMPLATES: Record<CallType, Partial<CustomerContext>> = {
  "cold-call": {
    notes: "Ziel: Interesse wecken, Termin vereinbaren.\nWichtig: Kurz halten, Mehrwert betonen.",
  },
  consulting: {
    notes: "Ziel: Bedürfnisse analysieren, Lösung präsentieren.\nWichtig: Zuhören, gezielte Fragen stellen.",
  },
  "follow-up": {
    notes: "Ziel: Offene Fragen klären, Abschluss erzielen.\nWichtig: Auf vorheriges Gespräch Bezug nehmen.",
  },
};

const CALL_TYPE_LABELS: Record<CallType, { label: string; icon: React.ReactNode }> = {
  "cold-call": { label: "Kaltakquise", icon: <Phone className="h-4 w-4" /> },
  consulting: { label: "Consulting", icon: <Briefcase className="h-4 w-4" /> },
  "follow-up": { label: "Follow-up", icon: <RotateCcw className="h-4 w-4" /> },
};

interface Props {
  onStart: (context: CustomerContext) => void;
}

export function SessionPreparation({ onStart }: Props) {
  const { subscription, openCustomerPortal } = useAuth();
  const navigate = useNavigate();

  const isLimitReached =
    subscription.subscribed &&
    subscription.minutesLimit < 999999 &&
    subscription.minutesUsed >= subscription.minutesLimit;

  // Determine next tier for upgrade CTA
  const tierKeys: TierKey[] = ["basic", "pro", "enterprise"];
  const currentTierIndex = subscription.tier ? tierKeys.indexOf(subscription.tier) : -1;
  const nextTier = currentTierIndex >= 0 && currentTierIndex < tierKeys.length - 1
    ? TIERS[tierKeys[currentTierIndex + 1]]
    : null;
  const [context, setContext] = useState<CustomerContext>({
    name: "",
    company: "",
    industry: "",
    callType: "cold-call",
    product: "",
    notes: TEMPLATES["cold-call"].notes || "",
  });

  const update = (key: keyof CustomerContext, value: string) => {
    setContext((prev) => ({ ...prev, [key]: value }));
  };

  const setCallType = (type: CallType) => {
    setContext((prev) => ({
      ...prev,
      callType: type,
      notes: TEMPLATES[type].notes || prev.notes,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-screen items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl border-border bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Sales Copilot
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Session vorbereiten
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Limit reached banner */}
          {isLimitReached && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Minutenlimit erreicht
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Du hast alle {subscription.minutesLimit} Minuten in diesem Monat verbraucht.
                    {nextTier
                      ? ` Upgrade auf ${nextTier.name} für ${nextTier.minutes_limit === Infinity ? "unbegrenzte" : nextTier.minutes_limit} Minuten.`
                      : " Dein Kontingent wird am Monatsanfang zurückgesetzt."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {nextTier && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={openCustomerPortal}
                  >
                    <ArrowUpCircle className="h-3.5 w-3.5" />
                    Upgrade auf {nextTier.name}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCustomerPortal}
                >
                  Abo verwalten
                </Button>
              </div>
            </div>
          )}
          {/* Call Type */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Gesprächstyp</Label>
            <RadioGroup
              value={context.callType}
              onValueChange={(v) => setCallType(v as CallType)}
              className="grid grid-cols-3 gap-3"
            >
              {(Object.keys(CALL_TYPE_LABELS) as CallType[]).map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                    context.callType === type
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value={type} className="sr-only" />
                  {CALL_TYPE_LABELS[type].icon}
                  <span className="text-sm font-medium">{CALL_TYPE_LABELS[type].label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-muted-foreground">Kundenname</Label>
              <Input
                id="name"
                value={context.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Max Mustermann"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-muted-foreground">Firma</Label>
              <Input
                id="company"
                value={context.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Muster GmbH"
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="industry" className="text-muted-foreground">Branche</Label>
              <Input
                id="industry"
                value={context.industry}
                onChange={(e) => update("industry", e.target.value)}
                placeholder="z.B. SaaS, E-Commerce"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product" className="text-muted-foreground">Produkt / Service</Label>
              <Input
                id="product"
                value={context.product}
                onChange={(e) => update("product", e.target.value)}
                placeholder="z.B. CRM-Software"
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-muted-foreground">Kontext & Hinweise</Label>
            <Textarea
              id="notes"
              value={context.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              className="bg-background font-mono text-sm"
            />
          </div>

          <Button
            onClick={() => onStart(context)}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
            disabled={isLimitReached}
          >
            <Mic className="h-4 w-4" />
            {isLimitReached ? "Minutenlimit erreicht" : "Gespräch starten"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
