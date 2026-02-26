import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptEntry } from "@/types/session";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  entries: TranscriptEntry[];
  partialText: string;
}

export function TranscriptPanel({ entries, partialText }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, partialText]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold text-foreground">Transkript</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    entry.speaker === "user" ? "bg-transcript-user" : "bg-transcript-customer"
                  }`}
                />
                <div className="min-w-0">
                  <span
                    className={`text-xs font-medium ${
                      entry.speaker === "user"
                        ? "text-transcript-user"
                        : "text-transcript-customer"
                    }`}
                  >
                    {entry.speaker === "user" ? "Du" : "Kunde"}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {entry.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {partialText && (
            <div className="flex gap-3 opacity-60">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted-foreground" />
              <p className="text-sm italic text-muted-foreground">{partialText}</p>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  );
}
