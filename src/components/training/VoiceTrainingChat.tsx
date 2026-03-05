import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Difficulty, TrainingScenario, ChatMessage, TrainingEvaluation } from "@/types/training";
import { useTrainingChat } from "@/hooks/useTrainingChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Mic, MicOff, Square, Loader2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  difficulty: Difficulty;
  scenario: TrainingScenario;
  onEnd: (messages: ChatMessage[], evaluation: TrainingEvaluation) => void;
}

const difficultyLabels: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: "Einfach", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  medium: { label: "Mittel", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  hard: { label: "Schwer", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function VoiceTrainingChat({ difficulty, scenario, onEnd }: Props) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { messages, isLoading, isSpeaking, sendMessage, startConversation, stopAudio } =
    useTrainingChat(difficulty, scenario);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);

  const onSpeechResult = useCallback(
    (text: string) => {
      if (!isLoading && !isSpeaking && text.trim()) {
        sendMessage(text);
      }
    },
    [isLoading, isSpeaking, sendMessage]
  );

  const { isListening, start: startListening, stop: stopListening } = useSpeechRecognition(onSpeechResult);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = async () => {
    setStarted(true);
    startTimeRef.current = Date.now();
    await startConversation();
    try {
      startListening();
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("training.micError"),
        description: (err as Error).message,
      });
    }
  };

  const handleEnd = async () => {
    stopListening();
    stopAudio();
    setIsEvaluating(true);

    try {
      const { data, error } = await supabase.functions.invoke("training-evaluate", {
        body: { transcript: messages, difficulty, scenario },
      });

      if (error) throw error;
      onEnd(messages, data as TrainingEvaluation);
    } catch (err) {
      console.error("Evaluation error:", err);
      toast({
        variant: "destructive",
        title: t("training.evalError"),
        description: (err as Error).message,
      });
      setIsEvaluating(false);
    }
  };

  const diff = difficultyLabels[difficulty];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={diff.color}>
            {diff.label}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {scenario === "cold-call" ? "Kaltakquise" : scenario === "consulting" ? "Beratung" : "Follow-up"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <Volume2 className="h-3.5 w-3.5 animate-pulse" />
              {t("training.botSpeaking")}
            </div>
          )}
          {started && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEnd}
              disabled={isEvaluating || messages.length < 2}
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  {t("training.evaluating")}
                </>
              ) : (
                <>
                  <Square className="mr-1.5 h-3.5 w-3.5" />
                  {t("training.endCall")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <ScrollArea className="flex-1 p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {!started && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Mic className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                {t("training.readyTitle")}
              </h2>
              <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
                {t("training.readyDesc")}
              </p>
              <Button onClick={handleStart} size="lg">
                <Mic className="mr-2 h-4 w-4" />
                {t("training.startCall")}
              </Button>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="mb-1 text-xs font-medium opacity-70">
                    {msg.role === "user" ? t("training.you") : t("training.customer")}
                  </p>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Mic status bar */}
      {started && !isEvaluating && (
        <div className="flex items-center justify-center gap-3 border-t border-border px-4 py-3">
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            isListening ? "bg-primary/10" : "bg-muted/30"
          }`}>
            {isListening ? (
              <>
                <Mic className="h-4 w-4 text-primary animate-pulse-recording" />
                <span className="text-sm text-primary font-medium">{t("training.listening")}</span>
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("training.micOff")}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
