import { useEffect, useRef } from "react";
import { SessionHeader } from "./SessionHeader";
import { TranscriptPanel } from "./TranscriptPanel";
import { SuggestionsPanel } from "./SuggestionsPanel";
import { useTranscription } from "@/hooks/useTranscription";
import { useSuggestions } from "@/hooks/useSuggestions";
import { CustomerContext, TranscriptEntry } from "@/types/session";
import { useToast } from "@/hooks/use-toast";

interface Props {
  context: CustomerContext;
  onStop: (entries: TranscriptEntry[]) => void;
}

export function LiveSession({ context, onStop }: Props) {
  const { entries, partialText, isConnected, isPaused, currentSpeaker, start, stop, pause, resume, toggleSpeaker } =
    useTranscription();
  const { suggestions, isLoading, generateSuggestion } = useSuggestions(context);
  const { toast } = useToast();
  const prevEntriesLength = useRef(0);

  useEffect(() => {
    start().catch((err) => {
      toast({
        variant: "destructive",
        title: "Mikrofon-Fehler",
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

  const handleStop = () => {
    stop();
    onStop(entries);
  };

  return (
    <div className="flex h-full flex-col">
      <SessionHeader
        context={context}
        isRecording={isConnected}
        isPaused={isPaused}
        currentSpeaker={currentSpeaker}
        onPause={pause}
        onResume={resume}
        onStop={handleStop}
        onToggleSpeaker={toggleSpeaker}
      />
      <div className="grid flex-1 grid-cols-2 divide-x divide-border overflow-hidden">
        <TranscriptPanel entries={entries} partialText={partialText} />
        <SuggestionsPanel suggestions={suggestions} isLoading={isLoading} />
      </div>
    </div>
  );
}
