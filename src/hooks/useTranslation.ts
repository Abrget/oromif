import { useBoundStore } from "~/hooks/useBoundStore";
import { resolveLocale, translations, type Messages } from "~/locales";

export function useTranslation(): Messages {
  const code = useBoundStore((s) => s.currentlanguage.code);
  const locale = resolveLocale(code);
  return translations[locale] ?? translations.en;
}
