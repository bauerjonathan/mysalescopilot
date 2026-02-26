import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TranscriptEntry } from "@/types/session";

export function useTranscription() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [partialText, setPartialText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<"user" | "customer">("customer");
  const entryCounter = useRef(0);
  const speakerRef = useRef<"user" | "customer">("customer");
  const socketRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPausedRef = useRef(false);

  const toggleSpeaker = useCallback(() => {
    setCurrentSpeaker((prev) => {
      const next = prev === "customer" ? "user" : "customer";
      speakerRef.current = next;
      return next;
    });
  }, []);

  const start = useCallback(async () => {
    try {
      // 1. Get Gladia session from edge function
      const { data, error } = await supabase.functions.invoke("gladia-session-init");
      if (error || !data?.websocket_url) {
        const msg = data?.error || error?.message || "Keine Session erhalten";
        throw new Error(msg);
      }

      const wsUrl = data.websocket_url;

      // 2. Connect WebSocket
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      await new Promise<void>((resolve, reject) => {
        socket.addEventListener("open", () => resolve());
        socket.addEventListener("error", () => reject(new Error("WebSocket Verbindung fehlgeschlagen")));
      });

      // 3. Handle incoming messages
      socket.addEventListener("message", (event) => {
        try {
          const message = JSON.parse(event.data.toString());
          if (message.type === "transcript") {
            const text = message.data?.utterance?.text;
            if (!text) return;

            if (isPausedRef.current) return;

            if (message.data.is_final) {
              setPartialText("");
              if (text.trim()) {
                const newEntry: TranscriptEntry = {
                  id: `t-${Date.now()}-${entryCounter.current++}`,
                  speaker: speakerRef.current,
                  text: text.trim(),
                  timestamp: Date.now(),
                };
                setEntries((prev) => [...prev, newEntry]);
              }
            } else {
              // Partial transcript
              setPartialText(text);
            }
          }
        } catch {
          // ignore non-JSON messages
        }
      });

      // 4. Get microphone and send audio chunks
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      // Use ScriptProcessorNode (widely supported) to capture PCM data
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return;

        const float32 = e.inputBuffer.getChannelData(0);
        // Convert float32 to int16 PCM
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        socket.send(int16.buffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsConnected(true);
    } catch (err) {
      console.error("Transcription start failed:", err);
      throw err;
    }
  }, []);

  const stop = useCallback(() => {
    // Send stop_recording to Gladia
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "stop_recording" }));
      socketRef.current.close();
    }
    socketRef.current = null;

    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setPartialText("");
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    isPausedRef.current = false;
  }, []);

  return {
    entries,
    partialText,
    isConnected,
    isPaused,
    currentSpeaker,
    start,
    stop,
    pause,
    resume,
    toggleSpeaker,
  };
}
