import { useState, useEffect } from "react";
import { Building2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyProfile, CompanyProfile as CP } from "@/hooks/useCompanyProfile";

const CompanyProfile = () => {
  const { profile, isLoading, save, isSaving } = useCompanyProfile();
  const [form, setForm] = useState<CP>(profile);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const update = (field: keyof CP, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Meine Firma <Building2 className="h-8 w-8 text-primary" />
        </h1>
        <p className="text-muted-foreground mt-2">
          Gib deinem KI-Assistenten Kontext zu deiner Firma, damit die Antwortvorschläge
          während Verkaufsgesprächen relevanter und präziser werden.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🏢 Sales-Kontext & Messaging
          </CardTitle>
          <CardDescription>
            Diese Informationen werden vom KI-Assistenten genutzt, um kontextbezogene
            und relevante Antworten während deiner Sales-Calls zu liefern.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_name">Firmenname</Label>
            <Input
              id="company_name"
              placeholder="z.B. AssistAI, TechSolutions GmbH..."
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_description">Was verkaufst du? (in 1-2 Sätzen)</Label>
            <Textarea
              id="product_description"
              placeholder="z.B. KI-gestützte Kundenservice-Software, die Antwortzeiten um 70% reduziert..."
              value={form.product_description}
              onChange={(e) => update("product_description", e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">An wen verkaufst du?</Label>
            <Textarea
              id="target_audience"
              placeholder="z.B. Mittelständische SaaS-Unternehmen mit 50-500 Mitarbeitern, Customer Success Manager..."
              value={form.target_audience}
              onChange={(e) => update("target_audience", e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pain_points">Welche Probleme löst du?</Label>
            <Textarea
              id="pain_points"
              placeholder="z.B. Lange Antwortzeiten, manuelle Prozesse, niedrige Kundenzufriedenheit..."
              value={form.pain_points}
              onChange={(e) => update("pain_points", e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unique_selling_points">Was unterscheidet euch vom Wettbewerb?</Label>
            <Textarea
              id="unique_selling_points"
              placeholder="z.B. Einzige Lösung mit Echtzeit-Sentimentanalyse, 99.9% Uptime SLA..."
              value={form.unique_selling_points}
              onChange={(e) => update("unique_selling_points", e.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_context">Zusätzlicher Kontext (optional)</Label>
            <Textarea
              id="additional_context"
              placeholder="Weitere Informationen, die dein KI-Assistent kennen sollte..."
              value={form.additional_context}
              onChange={(e) => update("additional_context", e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </div>

          <Button
            onClick={() => save(form)}
            disabled={isSaving}
            className="w-full gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Wird gespeichert..." : "Profil speichern"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;
