import type { LocalizedString } from "@/utils/helpers";

const dictionary: Record<string, Partial<LocalizedString>> = {
  "paella de mariscos": { en: "Seafood Paella", ca: "Paella de Marisc" },
  "bocadillo": { en: "Sandwich", ca: "Entrepà" },
  "ensalada": { en: "Salad", ca: "Amanida" },
  "hamburguesa": { en: "Burger", ca: "Hamburguesa" },
  "tapas": { en: "Tapas", ca: "Tapes" },
  "postre": { en: "Dessert", ca: "Postres" },
};

export async function translateFromSpanish(es: string): Promise<Pick<LocalizedString, "en" | "ca">> {
  const text = es.trim();
  if (!text) return { en: "", ca: "" };

  const apiUrl = import.meta.env.VITE_TRANSLATION_API_URL;
  const apiKey = import.meta.env.VITE_TRANSLATION_API_KEY;

  if (apiUrl) {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        text,
        source: "es",
        targets: ["en", "ca"],
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as Partial<Pick<LocalizedString, "en" | "ca">>;
      return {
        en: data.en || text,
        ca: data.ca || text,
      };
    }
  }

  const exact = dictionary[text.toLowerCase()];
  return {
    en: exact?.en || text,
    ca: exact?.ca || text,
  };
}
