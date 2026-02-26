import { useState, useCallback, useRef } from "react";
import { useScribe, type ScribeHookOptions } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { TranscriptEntry } from "@/types/session";

export function useTranscription() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [partialText, setPartialText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const entryCounter = useRef(0);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: "vad" as any,
    onPartialTranscript: (data) => {
      if (!isPaused) {
        setPartialText(data.text);
      }
    },
    onCommittedTranscript: (data) => {
      if (!isPaused && data.text.trim()) {
        setPartialText("");
        const newEntry: TranscriptEntry = {
          id: `t-${Date.now()}-${entryCounter.current++}`,
          speaker: "customer", // Default - in real app would use diarization
          text: data.text.trim(),
          timestamp: Date.now(),
        };
        setEntries((prev) => [...prev, newEntry]);
      }
    },
  });

  const start = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("elevenlabs-scribe-token");
      if (error || !data?.token) {
        throw new Error("Kein Token erhalten");
      }

      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      setIsConnected(true);
    } catch (err) {
      console.error("Transcription start failed:", err);
      throw err;
    }
  }, [scribe]);

  const stop = useCallback(() => {
    scribe.disconnect();
    setIsConnected(false);
    setPartialText("");
  }, [scribe]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return {
    entries,
    partialText,
    isConnected,
    isPaused,
    start,
    stop,
    pause,
    resume,
  };
}
