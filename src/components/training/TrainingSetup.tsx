import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Difficulty, TrainingScenario } from "@/types/training";
import { GraduationCap, Smile, Meh, Angry, Phone, MessageSquare, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onStart: (difficulty: Difficulty, scenario: TrainingScenario) => void;
}

const difficulties: { value: Difficulty; icon: typeof Smile; label: string; desc: string; color: string }[] = [
  { value: "easy", icon: Smile, label: "Einfach", desc: "Freundlicher, interessierter Kunde", color: "text-green-500" },
  { value: "medium", icon: Meh, label: "Mittel", desc: "Skeptischer Kunde mit Einwänden", color: "text-yellow-500" },
  { value: "hard", icon: Angry, label: "Schwer", desc: "Abweisender, aggressiver Kunde", color: "text-destructive" },
];

const scenarios: { value: TrainingScenario; icon: typeof Phone; label: string; desc: string }[] = [
  { value: "cold-call", icon: Phone, label: "Kaltakquise", desc: "Unerwarteter Anruf, Interesse wecken" },
  { value: "consulting", icon: MessageSquare, label: "Beratung", desc: "Vereinbarter Termin, Bedarf analysieren" },
  { value: "follow-up", icon: RotateCcw, label: "Follow-up", desc: "Folgegespräch, Abschluss erzielen" },
];

export function TrainingSetup({ onStart }: Props) {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [scenario, setScenario] = useState<TrainingScenario>("cold-call");

  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("training.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("training.description")}</p>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("training.difficulty")}</CardTitle>
            <CardDescription>{t("training.difficultyDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as Difficulty)}
              className="grid grid-cols-3 gap-3"
            >
              {difficulties.map((d) => (
                <Label
                  key={d.value}
                  htmlFor={`diff-${d.value}`}
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    difficulty === d.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem value={d.value} id={`diff-${d.value}`} className="sr-only" />
                  <d.icon className={`h-8 w-8 ${d.color}`} />
                  <span className="text-sm font-semibold">{d.label}</span>
                  <span className="text-center text-xs text-muted-foreground">{d.desc}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("training.scenario")}</CardTitle>
            <CardDescription>{t("training.scenarioDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={scenario}
              onValueChange={(v) => setScenario(v as TrainingScenario)}
              className="grid grid-cols-3 gap-3"
            >
              {scenarios.map((s) => (
                <Label
                  key={s.value}
                  htmlFor={`scen-${s.value}`}
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    scenario === s.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem value={s.value} id={`scen-${s.value}`} className="sr-only" />
                  <s.icon className="h-6 w-6 text-foreground/70" />
                  <span className="text-sm font-semibold">{s.label}</span>
                  <span className="text-center text-xs text-muted-foreground">{s.desc}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Button onClick={() => onStart(difficulty, scenario)} className="w-full" size="lg">
          <Phone className="mr-2 h-4 w-4" />
          {t("training.startTraining")}
        </Button>
      </motion.div>
    </div>
  );
}
