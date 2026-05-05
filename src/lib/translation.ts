import type { LocalizedString } from "@/utils/helpers";
import i18n from "@/i18n";

const dictionary: Record<string, Partial<LocalizedString>> = {
  "paella de mariscos": { en: "Seafood Paella", ca: "Paella de Marisc" },
  "bocadillo": { en: "Sandwich", ca: "Entrepà" },
  "ensalada": { en: "Salad", ca: "Amanida" },
  "hamburguesa": { en: "Burger", ca: "Hamburguesa" },
  "tapas": { en: "Tapas", ca: "Tapes" },
  "postre": { en: "Dessert", ca: "Postres" },
};

function translateTokenWithI18n(token: string, lang: "en" | "ca"): string {
  const key = token.toLowerCase();
  const translated = i18n.t(`autoTranslate.dictionary.${key}`, { lng: lang, defaultValue: token });
  return translated || token;
}

function translatePhraseWithI18n(text: string, lang: "en" | "ca"): string {
  return text
    .split(/(\s+|[-/(),.:;])/g)
    .map((part) => {
      if (!part || /^(\s+|[-/(),.:;])$/.test(part)) return part;
      return translateTokenWithI18n(part, lang);
    })
    .join("");
}

function isUsableTranslation(original: string, translated: string | null): translated is string {
  if (!translated) return false;
  const o = original.trim().toLowerCase();
  const t = translated.trim().toLowerCase();
  return Boolean(t) && t !== o;
}

async function translateWithLibreTranslate(text: string, target: "en" | "ca"): Promise<string | null> {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "es",
        target,
        format: "text",
      }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { translatedText?: string };
    const translated = data.translatedText?.trim();
    return translated || null;
  } catch {
    return null;
  }
}

async function translateWithMyMemory(text: string, target: "en" | "ca"): Promise<string | null> {
  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", `es|${target}`);
    const response = await fetch(url.toString(), { method: "GET" });
    if (!response.ok) return null;
    const data = (await response.json()) as { responseData?: { translatedText?: string } };
    const translated = data.responseData?.translatedText?.trim();
    return translated || null;
  } catch {
    return null;
  }
}

async function translateWithPublicApi(text: string, target: "en" | "ca"): Promise<string | null> {
  const myMemory = await translateWithMyMemory(text, target);
  if (isUsableTranslation(text, myMemory)) return myMemory;

  const libre = await translateWithLibreTranslate(text, target);
  if (isUsableTranslation(text, libre)) return libre;

  return myMemory || libre;
}

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

  // Secondary fallback: public translator endpoint when no private API is configured.
  const [publicEn, publicCa] = await Promise.all([
    translateWithPublicApi(text, "en"),
    translateWithPublicApi(text, "ca"),
  ]);
  if (publicEn || publicCa) {
    return {
      en: publicEn || text,
      ca: publicCa || text,
    };
  }

  const exact = dictionary[text.toLowerCase()];
  if (exact?.en || exact?.ca) {
    return {
      en: exact.en || text,
      ca: exact.ca || text,
    };
  }

  return {
    en: translatePhraseWithI18n(text, "en"),
    ca: translatePhraseWithI18n(text, "ca"),
  };
}
