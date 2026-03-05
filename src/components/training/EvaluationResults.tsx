import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Difficulty, TrainingScenario, ChatMessage, TrainingEvaluation } from "@/types/training";
import { RotateCcw, Trophy, TrendingUp, Lightbulb, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  evaluation: TrainingEvaluation;
  difficulty: Difficulty;
  scenario: TrainingScenario;
  transcript: ChatMessage[];
  onRestart: () => void;
}

const categoryLabels: Record<string, { label: string; icon: typeof CheckCircle }> = {
  opening: { label: "Gesprächseröffnung", icon: CheckCircle },
  needs_analysis: { label: "Bedarfsanalyse", icon: CheckCircle },
  argumentation: { label: "Argumentation", icon: CheckCircle },
  objection_handling: { label: "Einwandbehandlung", icon: CheckCircle },
  closing: { label: "Abschluss", icon: CheckCircle },
};

function scoreColor(score: number) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-destructive";
}

function scoreProgressColor(score: number) {
  if (score >= 80) return "[&>div]:bg-green-500";
  if (score >= 60) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-destructive";
}

export function EvaluationResults({ evaluation, difficulty, scenario, onRestart }: Props) {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        {/* Overall Score */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className={`h-8 w-8 ${scoreColor(evaluation.overall_score)}`} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("training.evalTitle")}</h1>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Badge variant="outline">
              {difficulty === "easy" ? "Einfach" : difficulty === "medium" ? "Mittel" : "Schwer"}
            </Badge>
            <Badge variant="outline">
              {scenario === "cold-call" ? "Kaltakquise" : scenario === "consulting" ? "Beratung" : "Follow-up"}
            </Badge>
          </div>
          <div className={`mt-4 text-6xl font-bold ${scoreColor(evaluation.overall_score)}`}>
            {evaluation.overall_score}
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Category Scores */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t("training.categories")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(evaluation.categories).map(([key, cat]) => {
              const meta = categoryLabels[key];
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{meta?.label || key}</span>
                    <span className={`text-sm font-bold ${scoreColor(cat.score)}`}>{cat.score}</span>
                  </div>
                  <Progress value={cat.score} className={`h-2 ${scoreProgressColor(cat.score)}`} />
                  <p className="mt-1 text-xs text-muted-foreground">{cat.feedback}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Strengths & Improvements */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {t("training.strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-1 text-green-500">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-primary">
                <AlertCircle className="h-4 w-4" />
                {t("training.improvements")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-1 text-primary">→</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tip */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-5">
            <Lightbulb className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">{t("training.proTip")}</p>
              <p className="mt-1 text-sm text-foreground/80">{evaluation.tip}</p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onRestart} className="w-full" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("training.tryAgain")}
        </Button>
      </motion.div>
    </div>
  );
}
