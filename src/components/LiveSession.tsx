import { useEffect, useRef, useCallback } from "react";
import { SessionHeader } from "./SessionHeader";
import { TranscriptPanel } from "./TranscriptPanel";
import { SuggestionsPanel } from "./SuggestionsPanel";
import { useTranscription } from "@/hooks/useTranscription";
import { useSuggestions } from "@/hooks/useSuggestions";
import { CustomerContext, TranscriptEntry } from "@/types/session";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  context: CustomerContext;
  onStop: (entries: TranscriptEntry[]) => void;
}

export function LiveSession({ context, onStop }: Props) {
  const { entries, partialText, isConnected, isPaused, systemAudioActive, start, stop, pause, resume } =
    useTranscription();
  const { suggestions, isLoading, generateSuggestion } = useSuggestions(context);
  const { toast } = useToast();
  const prevEntriesLength = useRef(0);
  const sessionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    sessionStartTime.current = Date.now();
    start().catch((err) => {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: err.message || "Mikrofon konnte nicht aktiviert werden.",
      });
    });
    return () => stop();
  }, []);

  useEffect(() => {
    if (entries.length > prevEntriesLength.current) {
      prevEntriesLength.current = entries.length;
      generateSuggestion(entries);
    }
  }, [entries, generateSuggestion]);

  const trackUsage = useCallback(async () => {
    const elapsedMs = Date.now() - sessionStartTime.current;
    const minutes = Math.round((elapsedMs / 60000) * 100) / 100;
    if (minutes > 0) {
      try {
        await supabase.functions.invoke("track-usage", { body: { minutes } });
      } catch (err) {
        console.error("Usage tracking failed:", err);
      }
    }
  }, []);

  const handleStop = async () => {
    stop();
    await trackUsage();
    onStop(entries);
  };

  return (
    <div className="flex h-full flex-col">
      <SessionHeader
        context={context}
        isRecording={isConnected}
        isPaused={isPaused}
        systemAudioActive={systemAudioActive}
        onPause={pause}
        onResume={resume}
        onStop={handleStop}
      />
      <div className="grid flex-1 grid-cols-2 divide-x divide-border overflow-hidden">
        <TranscriptPanel entries={entries} partialText={partialText} />
        <SuggestionsPanel suggestions={suggestions} isLoading={isLoading} />
      </div>
    </div>
  );
}
