import { ArrowLeft, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Impressum() {
  const navigate = useNavigate();

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
        <div className="mx-auto max-w-2xl prose prose-neutral dark:prose-invert">
          <h1 className="text-3xl font-bold mb-8">Impressum</h1>

          <h2 className="text-xl font-semibold mt-6 mb-2">Angaben gemäß § 5 TMG</h2>
          <p>
            Jonathan Bauer<br />
            Ringstraße 12<br />
            90592 Schwarzenbruck
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Kontakt</h2>
          <p>
            E-Mail: kontakt@example.com<br />
            Telefon: +49 (0) 123 456789
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE XXX XXX XXX
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            Jonathan Bauer<br />
            Ringstraße 12<br />
            90592 Schwarzenbruck
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Haftungsausschluss</h2>
          <h3 className="text-lg font-medium mt-4 mb-1">Haftung für Inhalte</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
            Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-1">Haftung für Links</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          </p>
        </div>
      </main>
    </div>
  );
}
