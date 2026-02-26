import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiSuggestion } from "@/types/session";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MessageSquare, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  suggestions: AiSuggestion[];
  isLoading: boolean;
}

export function SuggestionsPanel({ suggestions, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [suggestions]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold text-foreground">KI-Vorschläge</h2>
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {suggestions.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg border p-3 ${
                  s.type === "objection"
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-suggestion-border bg-suggestion-bg"
                }`}
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  {s.type === "objection" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  )}
                  <span className="text-xs font-medium text-muted-foreground">
                    {s.type === "objection" ? "Einwandbehandlung" : "Antwortvorschlag"}
                  </span>
                </div>
                <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed text-foreground/90">
                  <ReactMarkdown>{s.text}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {suggestions.length === 0 && !isLoading && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Vorschläge erscheinen hier, sobald der Kunde spricht…
            </p>
          )}
        </div>
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  );
}
