import { useState, useRef } from "react";
import { SessionPreparation } from "@/components/SessionPreparation";
import { LiveSession } from "@/components/LiveSession";
import { SessionSummary } from "@/components/SessionSummary";
import { CustomerContext, SessionPhase, TranscriptEntry } from "@/types/session";

const Index = () => {
  const [phase, setPhase] = useState<SessionPhase>("preparation");
  const [context, setContext] = useState<CustomerContext | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);

  const handleStart = (ctx: CustomerContext) => {
    setContext(ctx);
    setPhase("live");
  };

  const handleStop = (entries: TranscriptEntry[]) => {
    transcriptRef.current = entries;
    setPhase("summary");
  };

  const handleNewSession = () => {
    setContext(null);
    transcriptRef.current = [];
    setPhase("preparation");
  };

  return (
    <div className="min-h-screen bg-background">
      {phase === "preparation" && <SessionPreparation onStart={handleStart} />}
      {phase === "live" && context && (
        <LiveSession context={context} onStop={handleStop} />
      )}
      {phase === "summary" && (
        <SessionSummary entries={transcriptRef.current} onNewSession={handleNewSession} />
      )}
    </div>
  );
};

export default Index;
