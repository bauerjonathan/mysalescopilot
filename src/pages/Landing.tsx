import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Mic,
    title: "Echtzeit-Transkription",
    description:
      "Jedes gesprochene Wort wird sofort erkannt und live angezeigt – direkt aus deinem Browser-Mikrofon.",
  },
  {
    icon: Brain,
    title: "KI-Antwortvorschläge",
    description:
      "Basierend auf dem Gesprächsverlauf und Kundenkontext generiert die KI sofort passende Antworten.",
  },
  {
    icon: Shield,
    title: "Einwandbehandlung",
    description:
      '„Zu teuer", „Kein Bedarf" – typische Einwände werden erkannt und mit bewährten Strategien gekontert.',
  },
  {
    icon: Target,
    title: "Kundenkontext",
    description:
      "Gib vorab Informationen zum Kunden ein und die KI passt ihre Vorschläge individuell an.",
  },
  {
    icon: Clock,
    title: "Gesprächs-Zusammenfassung",
    description:
      "Nach jedem Gespräch erhältst du ein vollständiges Transkript zum Nachlesen und Kopieren.",
  },
  {
    icon: TrendingUp,
    title: "Mehr Abschlüsse",
    description:
      "Reagiere schneller, argumentiere besser und überzeuge mehr Kunden – in Echtzeit.",
  },
];

const tierEntries = Object.entries(TIERS) as [string, typeof TIERS[keyof typeof TIERS]][];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
            {user ? (
              <Button
                onClick={() => navigate("/app")}
                size="sm"
                className="gap-1.5"
              >
                Zur App <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  Anmelden
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  size="sm"
                  className="gap-1.5"
                >
                  Jetzt starten <ArrowRight className="h-3.5 w-3.5" />
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
           <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground mb-6">
              <Zap className="mr-1.5 h-3 w-3 text-primary" />
              KI-gestützter Sales-Assistent
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Dein unsichtbarer{" "}
            <span className="text-primary">Verkaufscoach</span>
            <br />
            in Echtzeit
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            SalesCopilot hört bei jedem Verkaufsgespräch mit, transkribiert live
            und liefert dir KI-gestützte Antwortvorschläge – bevor dein Kunde
            fertig gesprochen hat.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="gap-2 px-8 text-base"
            >
              <Play className="h-4 w-4" />
              Jetzt starten
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="gap-2 px-8 text-base"
            >
              Preise ansehen
            </Button>
          </motion.div>

          {/* Mock UI preview */}
          <motion.div
            className="mx-auto mt-16 max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-primary/10 bg-[hsl(220,18%,10%)]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(220,18%,8%)] border-b border-white/10">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-white/40 font-mono">
                  SalesCopilot — Live Session
                </span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-white/10">
                {/* Transcript */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-white/40 font-mono mb-2 tracking-wider">
                    TRANSKRIPT
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">
                      <span className="text-blue-400 font-medium">Du: </span>
                      <span className="text-white/80">
                        Unsere Plattform automatisiert Ihre komplette Rechnungsstellung – von der Erstellung bis zum Versand.
                      </span>
                    </p>
                    <p className="text-sm leading-relaxed">
                      <span className="text-amber-400 font-medium">Kunde: </span>
                      <span className="text-white/80">
                        Das klingt gut, aber ehrlich gesagt haben wir gerade andere Prioritäten und kein Budget dafür eingeplant.
                      </span>
                    </p>
                  </div>
                </div>
                {/* AI Suggestions */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-white/40 font-mono mb-2 tracking-wider">
                    KI-VORSCHLAG
                  </p>
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 mb-2">
                    <p className="text-xs font-semibold text-red-400 mb-1">
                      ⚡ Einwand erkannt: Budget
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      „Verstehe ich – genau deshalb lohnt sich ein Blick: Unsere Kunden sparen im Schnitt <strong className="text-white">12 Stunden pro Monat</strong>. Darf ich Ihnen kurz zeigen, wie sich das bei Ihnen rechnet?"
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <p className="text-xs font-semibold text-emerald-400 mb-1">
                      💡 Alternativ
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      „Was wäre, wenn wir mit einem kostenlosen Pilotprojekt starten – ganz ohne Risiko für Sie?"
                    </p>
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
            <h2 className="text-3xl font-bold sm:text-4xl">
              Alles was du für bessere Gespräche brauchst
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Von der Vorbereitung bis zur Nachbereitung – SalesCopilot
              unterstützt dich in jeder Phase des Gesprächs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full border-border/50 bg-card/50 hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
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
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-16">
            So funktioniert's
          </h2>
          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Kundenkontext eingeben",
                desc: "Gib vor dem Gespräch Informationen zum Kunden ein – Name, Branche, Ziel. Die KI nutzt diese für passendere Vorschläge.",
              },
              {
                step: "02",
                title: "Gespräch starten",
                desc: "Klicke auf Start und führe dein Telefon- oder VoIP-Gespräch. SalesCopilot hört über dein Mikrofon mit.",
              },
              {
                step: "03",
                title: "Echtzeit-Coaching erhalten",
                desc: "Während du sprichst, erscheinen live Antwortvorschläge und Einwandbehandlungen auf deinem Bildschirm.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="flex gap-6 items-start"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <span className="text-4xl font-bold text-primary/30 font-mono shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Wähle deinen Plan
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Flexibel skalieren – von Einzelkämpfer bis Enterprise.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {tierEntries.map(([key, tier]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`h-full relative overflow-hidden ${key === "pro" ? "border-primary/50 shadow-lg shadow-primary/10" : "border-border/50"}`}>
                  {key === "pro" && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                      <span className="absolute top-4 right-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">Beliebt</span>
                    </>
                  )}
                  <CardHeader className="text-left">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription>
                      {tier.minutes_limit === Infinity ? "Unbegrenzte" : `${tier.minutes_limit}`} Minuten/Monat
                    </CardDescription>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold">{tier.price}€</span>
                      <span className="text-sm text-muted-foreground">/Monat</span>
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
                      size="lg"
                      className="w-full gap-2 text-base"
                      variant={key === "pro" ? "default" : "outline"}
                      onClick={() => navigate("/auth")}
                    >
                      Jetzt starten
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Alle Preise inkl. MwSt. · Jederzeit kündbar · Keine Bindung
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Bereit, mehr Gespräche zu gewinnen?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Starte jetzt und erlebe, wie KI deine Verkaufsgespräche
            transformiert.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="gap-2 px-10 text-base"
          >
            <Play className="h-4 w-4" />
            Jetzt starten
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
              Impressum
            </button>
            <button onClick={() => navigate("/datenschutz")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Datenschutz
            </button>
            <button onClick={() => navigate("/kontakt")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SalesCopilot. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
