import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Headphones, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Bitte gib deinen Namen ein.").max(100),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein.").max(255),
  message: z.string().trim().min(1, "Bitte gib eine Nachricht ein.").max(2000),
});

export default function Contact() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    // Simulate sending — replace with edge function if needed
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);

    toast({ title: "Nachricht gesendet!", description: "Wir melden uns so schnell wie möglich bei dir." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Headphones className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Sales<span className="text-primary">Copilot</span>
            </span>
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1 as any)} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück
          </Button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-bold mb-2 text-center">Kontakt</h1>
          <p className="text-muted-foreground text-center mb-8">
            Hast du Fragen oder Feedback? Schreib uns eine Nachricht.
          </p>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Dein Name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="deine@email.de"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht</Label>
                  <Textarea
                    id="message"
                    placeholder="Deine Nachricht..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full gap-2" disabled={sending}>
                  <Send className="h-4 w-4" />
                  {sending ? "Wird gesendet..." : "Nachricht senden"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
