import { useState, useCallback, useRef } from "react";
import { ChatMessage, Difficulty, TrainingScenario, TrainingPersona } from "@/types/training";
import { CompanyProfile } from "@/hooks/useCompanyProfile";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/training-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/training-tts`;

interface TrainingChatOptions {
  difficulty: Difficulty;
  scenario: TrainingScenario;
  persona?: TrainingPersona;
  companyProfile?: CompanyProfile;
}

export function useTrainingChat({ difficulty, scenario, persona, companyProfile }: TrainingChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stopAudioInternal = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const playBrowserTTS = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    stopAudioInternal();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [stopAudioInternal]);

  const playTTS = useCallback(async (text: string) => {
    try {
      stopAudioInternal();
      setIsSpeaking(true);
        },
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) {
        console.warn("ElevenLabs TTS unavailable, falling back to browser TTS");
        playBrowserTTS(text);
        return;
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (err) {
      console.error("TTS error, using browser fallback:", err);
      playBrowserTTS(text);
    }
  }, [playBrowserTTS]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const userMsg: ChatMessage = { role: "user", content: userText };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      let assistantText = "";

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: updatedMessages,
            difficulty,
            scenario,
            persona,
            companyProfile,
          }),
          signal: abortRef.current.signal,
        });

        if (!resp.ok || !resp.body) throw new Error("Stream failed");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                assistantText += content;
                const currentText = assistantText;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return prev.map((m, i) =>
                      i === prev.length - 1 ? { ...m, content: currentText } : m
                    );
                  }
                  return [...prev, { role: "assistant", content: currentText }];
                });
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        // Play TTS
        if (assistantText) {
          await playTTS(assistantText);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Training chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, difficulty, scenario, persona, companyProfile, playTTS]
  );

  const startConversation = useCallback(async () => {
    setMessages([]);
    setIsLoading(true);
    let assistantText = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hallo?" }],
          difficulty,
          scenario,
          persona,
          companyProfile,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantText += content;
              const currentText = assistantText;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: currentText } : m
                  );
                }
                return [
                  { role: "user", content: "Hallo?" },
                  { role: "assistant", content: currentText },
                ];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (assistantText) {
        await playTTS(assistantText);
      }
    } catch (err) {
      console.error("Start conversation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, scenario, persona, companyProfile, playTTS]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { messages, isLoading, isSpeaking, sendMessage, startConversation, stopAudio };
}
