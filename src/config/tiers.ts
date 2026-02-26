export const TIERS = {
  basic: {
    name: "Basic",
    price_id: "price_1T53dYCk4HYIidoP3bVSRBPm",
    product_id: "prod_U39xCTjLLk9Qwk",
    price: 49,
    minutes_limit: 200,
    features: [
      "200 Gesprächsminuten/Monat",
      "Echtzeit-Transkription",
      "KI-Antwortvorschläge",
      "Einwandbehandlung",
      "Kundenkontext-Eingabe",
      "Gesprächs-Zusammenfassungen",
    ],
  },
  pro: {
    name: "Pro",
    price_id: "price_1T53dqCk4HYIidoPI4reRX9q",
    product_id: "prod_U39xmXr3fgq0jw",
    price: 99,
    minutes_limit: 500,
    features: [
      "500 Gesprächsminuten/Monat",
      "Echtzeit-Transkription",
      "KI-Antwortvorschläge",
      "Einwandbehandlung",
      "Kundenkontext-Eingabe",
      "Gesprächs-Zusammenfassungen",
      "Prioritäts-Support",
      "Alle zukünftigen Updates",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price_id: "price_1T53enCk4HYIidoP2ANnLu6R",
    product_id: "prod_U39yD4VzCOAXVY",
    price: 199,
    minutes_limit: Infinity,
    features: [
      "Unbegrenzte Gesprächsminuten",
      "Echtzeit-Transkription",
      "KI-Antwortvorschläge",
      "Einwandbehandlung",
      "Kundenkontext-Eingabe",
      "Gesprächs-Zusammenfassungen",
      "Prioritäts-Support",
      "Alle zukünftigen Updates",
      "Dedizierter Ansprechpartner",
    ],
  },
} as const;

export type TierKey = keyof typeof TIERS;

export function getTierByProductId(productId: string): TierKey | null {
  for (const [key, tier] of Object.entries(TIERS)) {
    if (tier.product_id === productId) return key as TierKey;
  }
  return null;
}
