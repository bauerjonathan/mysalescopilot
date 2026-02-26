import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, User, Building, ArrowLeftRight } from "lucide-react";
import { CustomerContext } from "@/types/session";

interface Props {
  context: CustomerContext;
  isRecording: boolean;
  isPaused: boolean;
  currentSpeaker: "user" | "customer";
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onToggleSpeaker: () => void;
}

export function SessionHeader({ context, isRecording, isPaused, currentSpeaker, onPause, onResume, onStop, onToggleSpeaker }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Recording indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isPaused
                ? "bg-muted-foreground"
                : "bg-recording-active animate-pulse-recording"
            }`}
          />
          <span className="font-mono text-sm text-muted-foreground">
            {formatTime(elapsed)}
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        {/* Speaker toggle */}
        <Button
          variant={currentSpeaker === "user" ? "default" : "secondary"}
          size="sm"
          onClick={onToggleSpeaker}
          className="gap-1.5 min-w-[140px]"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {currentSpeaker === "user" ? "Ich spreche" : "Kunde spricht"}
        </Button>

        <div className="h-4 w-px bg-border" />

        {/* Customer info */}
        <div className="flex items-center gap-3 text-sm">
          {context.name && (
            <span className="flex items-center gap-1.5 text-foreground">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {context.name}
            </span>
          )}
          {context.company && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Building className="h-3.5 w-3.5" />
              {context.company}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={isPaused ? onResume : onPause}
          className="gap-1.5"
        >
          {isPaused ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
          {isPaused ? "Fortsetzen" : "Pause"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onStop}
          className="gap-1.5"
        >
          <Square className="h-3.5 w-3.5" />
          Beenden
        </Button>
      </div>
    </header>
  );
}
