import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Difficulty, TrainingScenario, TrainingPersona } from "@/types/training";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { GraduationCap, Phone, MessageSquare, RotateCcw, Clock, User, Building2, ArrowRight, Sparkles, Building, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import personaFriendly from "@/assets/persona-friendly.jpg";
import personaSkeptical from "@/assets/persona-skeptical.jpg";
import personaTough from "@/assets/persona-tough.jpg";

interface Props {
  onStart: (difficulty: Difficulty, scenario: TrainingScenario, persona?: TrainingPersona) => void;
}

interface ScenarioCard {
  difficulty: Difficulty;
  scenario: TrainingScenario;
  title: string;
  description: string;
  duration: string;
  persona: { name: string; role: string; company: string; image: string };
  icon: typeof Phone;
}

const scenarioCards: ScenarioCard[] = [
  {
    difficulty: "easy",
    scenario: "cold-call",
    title: "Erster Kontakt",
    description: "Kaltakquise mit einem freundlichen Ops-Manager, der offen für neue Lösungen ist – aber überzeugt werden will.",
    duration: "3 Min",
    persona: { name: "Thomas Berger", role: "Operations Manager", company: "Meridian Logistik", image: personaFriendly },
    icon: Phone,
  },
  {
    difficulty: "medium",
    scenario: "consulting",
    title: "Beratung mit Einwänden",
    description: "Vereinbarter Beratungstermin mit einer skeptischen IT-Leiterin. Analysiere ihren Bedarf und entkräfte ihre Einwände.",
    duration: "5 Min",
    persona: { name: "Dr. Sandra Weiß", role: "IT-Leiterin", company: "DataFlow AG", image: personaSkeptical },
    icon: MessageSquare,
  },
  {
    difficulty: "hard",
    scenario: "cold-call",
    title: "Der harte Anruf",
    description: "Kaltakquise bei einem abweisenden Einkaufsleiter, der dir 30 Sekunden gibt. Überzeuge ihn, bevor er auflegt.",
    duration: "3 Min",
    persona: { name: "Klaus Richter", role: "Einkaufsleiter", company: "Atlas Distribution", image: personaTough },
    icon: Phone,
  },
  {
    difficulty: "easy",
    scenario: "consulting",
    title: "Bedarfsanalyse",
    description: "Ein interessierter Geschäftsführer hat einen Termin vereinbart. Finde heraus, was er braucht, und präsentiere deine Lösung.",
    duration: "5 Min",
    persona: { name: "Thomas Berger", role: "Geschäftsführer", company: "NovaTech GmbH", image: personaFriendly },
    icon: MessageSquare,
  },
  {
    difficulty: "medium",
    scenario: "follow-up",
    title: "Follow-up: Abschluss",
    description: "Folgegespräch nach einer Demo. Die Kundin hat noch Bedenken zum Preis und zur Implementierung – bringe den Deal zum Abschluss.",
    duration: "5 Min",
    persona: { name: "Dr. Sandra Weiß", role: "COO", company: "CloudBase Solutions", image: personaSkeptical },
    icon: RotateCcw,
  },
  {
    difficulty: "hard",
    scenario: "follow-up",
    title: "Letzte Chance",
    description: "Der Kunde droht zur Konkurrenz zu wechseln. Dies ist dein letzter Versuch, den Account zu retten.",
    duration: "5 Min",
    persona: { name: "Klaus Richter", role: "Vorstand", company: "Stahl & Partner", image: personaTough },
    icon: RotateCcw,
  },
];

const difficultyConfig: Record<Difficulty, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  easy: { label: "Einfach", variant: "default" },
  medium: { label: "Mittel", variant: "secondary" },
  hard: { label: "Schwer", variant: "destructive" },
};

const categoryLabels: Record<string, { label: string; icon: typeof Phone }> = {
  "cold-call": { label: "Kaltakquise", icon: Phone },
  "consulting": { label: "Beratungsgespräche", icon: MessageSquare },
  "follow-up": { label: "Follow-up & Abschluss", icon: RotateCcw },
};

export function TrainingSetup({ onStart }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useCompanyProfile();

  const hasProfile = !!(profile?.company_name && profile?.product_description);

  // Group cards by scenario
  const grouped = scenarioCards.reduce((acc, card) => {
    if (!acc[card.scenario]) acc[card.scenario] = [];
    acc[card.scenario].push(card);
    return acc;
  }, {} as Record<string, ScenarioCard[]>);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("training.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("training.description")}</p>
            </div>
          </div>
        </motion.div>

        {/* Company context banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          {hasProfile ? (
            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("training.personalizedFor", { company: profile?.company_name })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("training.personalizedDesc")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {t("training.noProfileTitle")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("training.noProfileDesc")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/app/firma")}
                className="shrink-0 gap-1.5"
              >
                {t("training.setupProfile")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Scenario Categories */}
        {Object.entries(grouped).map(([scenario, cards], groupIdx) => {
          const cat = categoryLabels[scenario];
          return (
            <motion.div
              key={scenario}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
              className="mb-10"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <cat.icon className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{cat.label}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cards.map((card, cardIdx) => {
                  const diff = difficultyConfig[card.difficulty];
                  return (
                    <motion.div
                      key={`${card.scenario}-${card.difficulty}-${cardIdx}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIdx * 0.1 + cardIdx * 0.05 }}
                    >
                      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30 flex flex-col h-full">
                        <div className="p-5 flex flex-col flex-1">
                          {/* Top row: title + avatar */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-foreground mb-1.5">{card.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={diff.variant} className="text-xs">
                                  {diff.label}
                                </Badge>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {card.duration}
                                </span>
                              </div>
                            </div>
                            <img
                              src={card.persona.image}
                              alt={card.persona.name}
                              className="h-14 w-14 rounded-xl object-cover ring-2 ring-border shadow-sm flex-shrink-0"
                            />
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                            {card.description}
                          </p>

                          {/* Persona info */}
                          <div className="bg-muted/20 rounded-lg p-3 mb-4">
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Dein Gesprächspartner:</p>
                            <div className="flex items-center gap-1.5 text-sm text-foreground">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">{card.persona.name}</span>
                              <span className="text-muted-foreground">– {card.persona.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                              <Building2 className="h-3.5 w-3.5" />
                              <span>{card.persona.company}</span>
                            </div>
                          </div>

                          {/* CTA */}
                          <Button
                            onClick={() => onStart(card.difficulty, card.scenario, card.persona)}
                            className="w-full group/btn"
                            size="default"
                          >
                            <Phone className="h-4 w-4 mr-1.5" />
                            Training starten
                            <ArrowRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
