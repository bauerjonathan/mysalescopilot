import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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

const pricingFeatures = [
  "Unbegrenzte Gespräche",
  "Echtzeit-Transkription",
  "KI-Antwortvorschläge",
  "Einwandbehandlung",
  "Kundenkontext-Eingabe",
  "Gesprächs-Zusammenfassungen",
  "Alle zukünftigen Updates",
  "Prioritäts-Support",
];

export default function Landing() {
  const navigate = useNavigate();

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
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-medium">
              <Zap className="mr-1.5 h-3 w-3 text-primary" />
              KI-gestützter Sales-Assistent
            </Badge>
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
              Kostenlos testen
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
            <div className="rounded-xl border border-border bg-card p-1 shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  SalesCopilot — Live Session
                </span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground font-mono mb-2">
                    TRANSKRIPT
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-[hsl(var(--transcript-user))] font-medium">
                        Du:
                      </span>{" "}
                      <span className="text-foreground/80">
                        Guten Tag, ich rufe an wegen unserer neuen Lösung für...
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[hsl(var(--transcript-customer))] font-medium">
                        Kunde:
                      </span>{" "}
                      <span className="text-foreground/80">
                        Das klingt interessant, aber wir haben aktuell kein Budget...
                      </span>
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground font-mono mb-2">
                    KI-VORSCHLAG
                  </p>
                  <div className="rounded-lg border border-[hsl(var(--suggestion-border))] bg-[hsl(var(--suggestion-bg))] p-3">
                    <p className="text-xs font-semibold text-primary mb-1">
                      💡 Einwand: Budget
                    </p>
                    <p className="text-sm text-foreground/80">
                      „Ich verstehe. Darf ich fragen – was wäre, wenn sich die
                      Lösung innerhalb von 3 Monaten selbst refinanziert?"
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
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Ein Preis. Alles drin.
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Kein Kleingedrucktes, keine versteckten Kosten.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/30 bg-card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              <CardContent className="p-8">
                <Badge className="mb-4">Beliebtester Plan</Badge>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold">25€</span>
                  <span className="text-muted-foreground">/Monat</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                  Monatlich kündbar. Keine Bindung.
                </p>

                <ul className="space-y-3 text-left mb-8">
                  {pricingFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className="w-full gap-2 text-base"
                  onClick={() => navigate("/auth")}
                >
                  Jetzt starten
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  14 Tage kostenlos testen – keine Kreditkarte nötig
                </p>
              </CardContent>
            </Card>
          </motion.div>
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
            Kostenlos testen
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
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SalesCopilot. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
