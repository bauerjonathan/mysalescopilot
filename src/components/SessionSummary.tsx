import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, RotateCcw, Check, Download } from "lucide-react";
import { TranscriptEntry } from "@/types/session";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  entries: TranscriptEntry[];
  onNewSession: () => void;
}

export function SessionSummary({ entries, onNewSession }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fullText = entries
    .map((e) => `[${e.speaker === "user" ? "Du" : "Kunde"}] ${e.text}`)
    .join("\n\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast({ title: "Transkript kopiert!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const header = `SalesCopilot – Gesprächstranskript\nDatum: ${dateStr}, ${timeStr}\n${"─".repeat(40)}\n\n`;
    const content = header + fullText;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transkript-${now.toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Transkript heruntergeladen!" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-foreground">Gesprächszusammenfassung</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Exportieren
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Kopiert" : "Kopieren"}
            </Button>
            <Button size="sm" onClick={onNewSession} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Neue Session
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] rounded-lg border border-border bg-secondary/30 p-4">
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex gap-3">
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      entry.speaker === "user" ? "bg-transcript-user" : "bg-transcript-customer"
                    }`}
                  />
                  <div>
                    <span
                      className={`text-xs font-medium ${
                        entry.speaker === "user"
                          ? "text-transcript-user"
                          : "text-transcript-customer"
                      }`}
                    >
                      {entry.speaker === "user" ? "Du" : "Kunde"}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/90">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
