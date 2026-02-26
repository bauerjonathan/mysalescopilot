import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Datenschutz() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-8 gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Button>

        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Verantwortlicher</h2>
            <p>
              Jonathan Bauer<br />
              Ringstraße 12<br />
              90592 Schwarzenbruck<br />
              E-Mail: kontakt@example.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p>
              Beim Besuch unserer Website werden automatisch Informationen durch den Browser übermittelt und in Server-Logfiles gespeichert. Diese umfassen:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Browsertyp und -version</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mt-2">
              Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung mit anderen Datenquellen wird nicht vorgenommen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Registrierung und Nutzerkonto</h2>
            <p>
              Bei der Registrierung erheben wir Ihre E-Mail-Adresse und ein Passwort. Diese Daten werden zur Bereitstellung des Dienstes gespeichert und verarbeitet. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Sprachverarbeitung und Transkription</h2>
            <p>
              SalesCopilot nutzt Ihr Browser-Mikrofon zur Echtzeit-Transkription von Gesprächen. Die Audiodaten werden in Echtzeit an den Transkriptionsdienst (Gladia) übermittelt und dort verarbeitet. Es erfolgt keine dauerhafte Speicherung der Audiodaten durch uns. Die Transkripte werden nur während der aktiven Session im Browser gehalten und nicht serverseitig gespeichert.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. KI-gestützte Vorschläge</h2>
            <p>
              Die während eines Gesprächs generierten KI-Antwortvorschläge werden auf Basis des Gesprächsverlaufs und des eingegebenen Kundenkontexts erstellt. Diese Daten werden zur Verarbeitung an KI-Dienste übermittelt. Es erfolgt keine dauerhafte Speicherung der Gesprächsinhalte durch uns.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Zahlungsabwicklung</h2>
            <p>
              Die Zahlungsabwicklung erfolgt über Stripe. Dabei werden Ihre Zahlungsdaten direkt von Stripe verarbeitet. Wir haben keinen Zugriff auf vollständige Kreditkarten- oder Kontodaten. Die Datenschutzerklärung von Stripe finden Sie unter{" "}
              <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                stripe.com/de/privacy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Cookies</h2>
            <p>
              Wir verwenden technisch notwendige Cookies zur Aufrechterhaltung Ihrer Sitzung (Session-Cookies). Diese sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Ihre Rechte</h2>
            <p>Sie haben das Recht auf:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-2">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte Kontaktadresse.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Beschwerderecht</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Aktualität</h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig. Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
