import { useState, useCallback, useRef } from "react";
import { TranscriptEntry, AiSuggestion, CustomerContext } from "@/types/session";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sales-copilot-suggest`;

export function useSuggestions(context: CustomerContext) {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastProcessed = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateSuggestion = useCallback(
    (entries: TranscriptEntry[]) => {
      // Only process new customer entries
      const newEntries = entries.filter(
        (e) => e.timestamp > lastProcessed.current && e.speaker === "customer"
      );
      if (newEntries.length === 0) return;

      // Debounce: wait 800ms after last customer utterance before triggering
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        // Abort any in-flight request
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const signal = abortRef.current.signal;

        lastProcessed.current = Date.now();
        setIsLoading(true);

        const suggestionId = `s-${Date.now()}`;
        let fullText = "";

        try {
          const resp = await fetch(CHAT_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              transcript: entries.map((e) => ({
                speaker: e.speaker === "user" ? "Verkäufer" : "Kunde",
                text: e.text,
              })),
              context: {
                customerName: context.name,
                company: context.company,
                industry: context.industry,
                callType: context.callType,
                product: context.product,
                notes: context.notes,
              },
              latestCustomerMessage: newEntries[newEntries.length - 1].text,
            }),
            signal,
          });

          if (!resp.ok || !resp.body) throw new Error("Stream failed");

          const reader = resp.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          const isObjection = /zu teuer|kein bedarf|kein interesse|nicht interessiert|zu viel|brauchen wir nicht/i.test(
            newEntries[newEntries.length - 1].text
          );

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (signal.aborted) {
              reader.cancel();
              return;
            }
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
                  fullText += content;
                  const currentText = fullText;
                  setSuggestions((prev) => {
                    const existing = prev.find((s) => s.id === suggestionId);
                    if (existing) {
                      return prev.map((s) =>
                        s.id === suggestionId ? { ...s, text: currentText } : s
                      );
                    }
                    return [
                      ...prev,
                      {
                        id: suggestionId,
                        text: currentText,
                        type: isObjection ? "objection" : "response",
                        timestamp: Date.now(),
                        isStreaming: true,
                      },
                    ];
                  });
                }
              } catch {
                buffer = line + "\n" + buffer;
                break;
              }
            }
          }

          // Finalize
          setSuggestions((prev) =>
            prev.map((s) => (s.id === suggestionId ? { ...s, isStreaming: false } : s))
          );
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          console.error("Suggestion generation failed:", err);
        } finally {
          setIsLoading(false);
        }
      }, 800);
    },
    [context]
  );

  return { suggestions, isLoading, generateSuggestion };
}
