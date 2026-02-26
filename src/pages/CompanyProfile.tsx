import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
          {t("company.title")} <Building2 className="h-8 w-8 text-primary" />
        </h1>
        <p className="text-muted-foreground mt-2">{t("company.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {t("company.cardTitle")}
          </CardTitle>
          <CardDescription>{t("company.cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_name">{t("company.companyName")}</Label>
            <Input id="company_name" placeholder={t("company.companyNamePlaceholder")} value={form.company_name} onChange={(e) => update("company_name", e.target.value)} maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_description">{t("company.whatDoYouSell")}</Label>
            <Textarea id="product_description" placeholder={t("company.whatDoYouSellPlaceholder")} value={form.product_description} onChange={(e) => update("product_description", e.target.value)} rows={3} maxLength={1000} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">{t("company.whoDoYouSellTo")}</Label>
            <Textarea id="target_audience" placeholder={t("company.whoDoYouSellToPlaceholder")} value={form.target_audience} onChange={(e) => update("target_audience", e.target.value)} rows={3} maxLength={1000} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pain_points">{t("company.whatProblemsDoYouSolve")}</Label>
            <Textarea id="pain_points" placeholder={t("company.whatProblemsDoYouSolvePlaceholder")} value={form.pain_points} onChange={(e) => update("pain_points", e.target.value)} rows={3} maxLength={1000} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unique_selling_points">{t("company.whatMakesYouDifferent")}</Label>
            <Textarea id="unique_selling_points" placeholder={t("company.whatMakesYouDifferentPlaceholder")} value={form.unique_selling_points} onChange={(e) => update("unique_selling_points", e.target.value)} rows={3} maxLength={1000} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_context">{t("company.additionalContext")}</Label>
            <Textarea id="additional_context" placeholder={t("company.additionalContextPlaceholder")} value={form.additional_context} onChange={(e) => update("additional_context", e.target.value)} rows={3} maxLength={2000} />
          </div>

          <Button onClick={() => save(form)} disabled={isSaving} className="w-full gap-2" size="lg">
            <Save className="h-4 w-4" />
            {isSaving ? t("company.saving") : t("company.saveProfile")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;
