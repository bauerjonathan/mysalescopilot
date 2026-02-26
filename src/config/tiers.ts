export const FREE_MINUTES_LIMIT = 5;

export const TIERS = {
  free: {
    name: "Free",
    price_id: null,
    product_id: null,
    price: 0,
    minutes_limit: FREE_MINUTES_LIMIT,
    features: [
      `${FREE_MINUTES_LIMIT} Test-Minuten`,
      "Echtzeit-Transkription",
      "KI-Antwortvorschläge",
      "Einwandbehandlung",
    ],
  },
  unlimited: {
    name: "Unlimited",
    price_id: "price_1T55mQCk4HYIidoP59BFPcHJ",
    product_id: "prod_U3CAfkL2MndN2d",
    price: 29,
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
