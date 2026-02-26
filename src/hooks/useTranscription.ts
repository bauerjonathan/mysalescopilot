import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TranscriptEntry } from "@/types/session";

export function useTranscription() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [partialText, setPartialText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [systemAudioActive, setSystemAudioActive] = useState(false);
  const entryCounter = useRef(0);
  const socketRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isPausedRef = useRef(false);

  const start = useCallback(async () => {
    try {
      // 1. Get Gladia session from edge function
      const { data, error } = await supabase.functions.invoke("gladia-session-init");
      if (error || !data?.websocket_url) {
        const msg = data?.error || error?.message || "Keine Session erhalten";
        throw new Error(msg);
      }

      // 2. Connect WebSocket
      const socket = new WebSocket(data.websocket_url);
      socketRef.current = socket;

      await new Promise<void>((resolve, reject) => {
        socket.addEventListener("open", () => resolve());
        socket.addEventListener("error", () => reject(new Error("WebSocket Verbindung fehlgeschlagen")));
      });

      // 3. Handle incoming messages – channel 0 = mic (user), channel 1 = system (customer)
      socket.addEventListener("message", (event) => {
        try {
          const message = JSON.parse(event.data.toString());
          if (message.type === "transcript") {
            const text = message.data?.utterance?.text;
            if (!text || isPausedRef.current) return;

            // Determine speaker from channel index
            const channel: number = message.data?.utterance?.channel ?? message.data?.channel ?? 0;
            const speaker: "user" | "customer" = channel === 0 ? "user" : "customer";

            if (message.data.is_final) {
              setPartialText("");
              if (text.trim()) {
                const newEntry: TranscriptEntry = {
                  id: `t-${Date.now()}-${entryCounter.current++}`,
                  speaker,
                  text: text.trim(),
                  timestamp: Date.now(),
                };
                setEntries((prev) => [...prev, newEntry]);
              }
            } else {
              setPartialText(text);
            }
          }
        } catch {
          // ignore non-JSON messages
        }
      });

      // 4. Capture microphone (channel 0 – user)
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      micStreamRef.current = micStream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const micSource = audioContext.createMediaStreamSource(micStream);

      // 5. Try to capture system/display audio (channel 1 – customer)
      let displaySource: MediaStreamAudioSourceNode | null = null;
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true, // required by browsers, but we only need audio
          audio: true,
        });
        displayStreamRef.current = displayStream;

        // Stop the video track immediately – we only need audio
        displayStream.getVideoTracks().forEach((t) => t.stop());

        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length > 0) {
          displaySource = audioContext.createMediaStreamSource(
            new MediaStream(audioTracks)
          );
          setSystemAudioActive(true);
        }
      } catch {
        // User declined screen share – mic-only mode, all audio goes as user
        console.warn("System audio capture declined – mic-only mode");
        setSystemAudioActive(false);
      }

      // 6. Create stereo mixer: L = mic (user), R = system (customer)
      const merger = audioContext.createChannelMerger(2);
      micSource.connect(merger, 0, 0); // mic → left channel
      if (displaySource) {
        displaySource.connect(merger, 0, 1); // system → right channel
      } else {
        // Fill right channel with silence so Gladia still gets stereo
        const silence = audioContext.createBufferSource();
        const silentBuffer = audioContext.createBuffer(1, 1024, 16000);
        silence.buffer = silentBuffer;
        silence.loop = true;
        silence.start();
        silence.connect(merger, 0, 1);
      }

      // 7. Convert stereo float32 to interleaved int16 PCM and send
      const processor = audioContext.createScriptProcessor(4096, 2, 2);
      merger.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return;

        const left = e.inputBuffer.getChannelData(0);
        const right = e.inputBuffer.getChannelData(1);
        // Interleave L/R into int16 PCM
        const int16 = new Int16Array(left.length * 2);
        for (let i = 0; i < left.length; i++) {
          const sL = Math.max(-1, Math.min(1, left[i]));
          const sR = Math.max(-1, Math.min(1, right[i]));
          int16[i * 2] = sL < 0 ? sL * 0x8000 : sL * 0x7fff;
          int16[i * 2 + 1] = sR < 0 ? sR * 0x8000 : sR * 0x7fff;
        }
        socket.send(int16.buffer);
      };

      processorRef.current = processor;

      setIsConnected(true);
    } catch (err) {
      console.error("Transcription start failed:", err);
      throw err;
    }
  }, []);

  const stop = useCallback(() => {
    // 1. Disconnect audio processing first
    try {
      processorRef.current?.disconnect();
      processorRef.current = null;
    } catch { /* ignore */ }

    // 2. Close WebSocket (handle any readyState)
    try {
      const ws = socketRef.current;
      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "stop_recording" }));
        }
        ws.close();
      }
    } catch { /* ignore */ }
    socketRef.current = null;

    // 3. Stop all media tracks
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;

    displayStreamRef.current?.getTracks().forEach((t) => t.stop());
    displayStreamRef.current = null;

    // 4. Close audio context
    try {
      audioContextRef.current?.close();
    } catch { /* ignore */ }
    audioContextRef.current = null;

    setIsConnected(false);
    setPartialText("");
    setSystemAudioActive(false);
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
    systemAudioActive,
    start,
    stop,
    pause,
    resume,
  };
}
