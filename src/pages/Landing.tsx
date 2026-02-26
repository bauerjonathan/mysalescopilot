import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { TIERS } from "@/config/tiers";
import {
  Mic,
  Brain,
  MessageSquare,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Check,
  Play,
  Headphones,
  TrendingUp,
  Target,
  Globe,
  FileText,
  Star,
  Quote,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const tierEntries = Object.entries(TIERS) as [string, typeof TIERS[keyof typeof TIERS]][];

const LANG_LABELS: Record<string, string> = { de: "DE", en: "EN" };

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(next);
  };

  const features = [
    { icon: Mic, title: t("landing.featureTranscription"), description: t("landing.featureTranscriptionDesc") },
    { icon: Brain, title: t("landing.featureAI"), description: t("landing.featureAIDesc") },
    { icon: Shield, title: t("landing.featureObjection"), description: t("landing.featureObjectionDesc") },
    { icon: Target, title: t("landing.featureContext"), description: t("landing.featureContextDesc") },
    { icon: Clock, title: t("landing.featureSummary"), description: t("landing.featureSummaryDesc") },
    { icon: TrendingUp, title: t("landing.featureClose"), description: t("landing.featureCloseDesc") },
  ];

  const steps = [
    { step: "01", title: t("landing.step1Title"), desc: t("landing.step1Desc") },
    { step: "02", title: t("landing.step2Title"), desc: t("landing.step2Desc") },
    { step: "03", title: t("landing.step3Title"), desc: t("landing.step3Desc") },
    { step: "04", title: t("landing.step4Title"), desc: t("landing.step4Desc") },
  ];

  const reviews = [
    { text: t("landing.review1Text"), author: t("landing.review1Author"), role: t("landing.review1Role") },
    { text: t("landing.review2Text"), author: t("landing.review2Author"), role: t("landing.review2Role") },
    { text: t("landing.review3Text"), author: t("landing.review3Author"), role: t("landing.review3Role") },
  ];

  const faqs = [
    { q: t("landing.faq1Q"), a: t("landing.faq1A") },
    { q: t("landing.faq2Q"), a: t("landing.faq2A") },
    { q: t("landing.faq3Q"), a: t("landing.faq3A") },
    { q: t("landing.faq4Q"), a: t("landing.faq4A") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Headphones className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Sales<span className="text-primary">Copilot</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1.5 px-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">{LANG_LABELS[i18n.language] ?? "DE"}</span>
            </Button>

            {user ? (
              <Button onClick={() => navigate("/app")} size="sm" className="gap-1.5">
                {t("nav.goToApp")} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  {t("nav.signIn")}
                </Button>
                <Button onClick={() => navigate("/auth")} size="sm" className="gap-1.5">
                  {t("nav.getStarted")} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground mb-6">
              <Zap className="mr-1.5 h-3 w-3 text-primary" />
              {t("landing.aiSalesAssistant")}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {t("landing.heroTitle1")}{" "}
            <span className="text-primary">{t("landing.heroTitle2")}</span>
            <br />
            {t("landing.heroTitle3")}
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {t("landing.heroDesc")}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 px-8 text-base">
              <Play className="h-4 w-4" />
              {t("landing.getStarted")}
            </Button>
            <Button
              size="lg" variant="outline"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="gap-2 px-8 text-base"
            >
              {t("landing.viewPricing")}
            </Button>
          </motion.div>

          {/* Mock UI preview */}
          <motion.div
            className="mx-auto mt-16 max-w-3xl"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-primary/10 bg-[hsl(220,18%,10%)]">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(220,18%,8%)] border-b border-white/10">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-white/40 font-mono">{t("landing.liveSession")}</span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-4 space-y-3">
                  <p className="text-xs text-white/40 font-mono mb-2 tracking-wider">{t("landing.transcriptLabel")}</p>
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">
                      <span className="text-blue-400 font-medium">{t("landing.mockYou")}</span>
                      <span className="text-white/80">{t("landing.mockYouText")}</span>
                    </p>
                    <p className="text-sm leading-relaxed">
                      <span className="text-amber-400 font-medium">{t("landing.mockCustomer")}</span>
                      <span className="text-white/80">{t("landing.mockCustomerText")}</span>
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-white/40 font-mono mb-2 tracking-wider">{t("landing.aiSuggestionLabel")}</p>
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 mb-2">
                    <p className="text-xs font-semibold text-red-400 mb-1">{t("landing.mockObjection")}</p>
                    <p className="text-sm text-white/80 leading-relaxed">{t("landing.mockObjectionText")}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <p className="text-xs font-semibold text-emerald-400 mb-1">{t("landing.mockAlternative")}</p>
                    <p className="text-sm text-white/80 leading-relaxed">{t("landing.mockAlternativeText")}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">{t("landing.featuresTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">{t("landing.featuresDesc")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i}>
                <Card className="h-full border-border/50 bg-card/50 hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-16">{t("landing.howItWorks")}</h2>
          <div className="space-y-12">
            {steps.map((item, i) => (
              <motion.div key={item.step} className="flex gap-6 items-start" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <span className="text-4xl font-bold text-primary/30 font-mono shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-16">{t("landing.reviewsTitle")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="h-full border-border/50 bg-card/50">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <Quote className="h-5 w-5 text-primary/30 mb-2" />
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{r.text}</p>
                    <div className="border-t border-border/50 pt-4">
                      <p className="text-sm font-semibold">{r.author}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-12">{t("landing.faqTitle")}</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left text-sm hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{t("landing.pricingTitle")}</h2>
          <p className="text-muted-foreground text-lg mb-12">{t("landing.pricingDesc")}</p>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {tierEntries.map(([key, tier]) => (
              <motion.div key={key} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Card className={`h-full relative overflow-hidden ${key === "unlimited" ? "border-primary/50 shadow-lg shadow-primary/10" : "border-border/50"}`}>
                  {key === "unlimited" && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                      <span className="absolute top-4 right-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{t("landing.popular")}</span>
                    </>
                  )}
                  <CardHeader className="text-left">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription>
                      {key === "free" ? t("landing.freeDesc") : t("landing.unlimitedDesc")}
                    </CardDescription>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold">{tier.price === 0 ? t("landing.free") : `${tier.price}€`}</span>
                      {tier.price > 0 && <span className="text-sm text-muted-foreground">{t("landing.perMonth")}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="text-left space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="lg" className="w-full gap-2 text-base"
                      variant={key === "unlimited" ? "default" : "outline"}
                      onClick={() => navigate("/auth")}
                    >
                      {key === "free" ? t("landing.tryNow") : t("landing.startNow")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{t("landing.noCreditCard")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{t("landing.ctaTitle")}</h2>
          <p className="text-muted-foreground text-lg mb-8">{t("landing.ctaDesc")}</p>
          <Button size="lg" onClick={() => navigate("/auth")} className="gap-2 px-10 text-base">
            <Play className="h-4 w-4" />
            {t("landing.getStarted")}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">SalesCopilot</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/impressum")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("landing.impressum")}
            </button>
            <button onClick={() => navigate("/datenschutz")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("landing.datenschutz")}
            </button>
            <button onClick={() => navigate("/kontakt")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("landing.kontakt")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SalesCopilot. {t("landing.allRightsReserved")}
          </p>
        </div>
      </footer>
    </div>
  );
}
