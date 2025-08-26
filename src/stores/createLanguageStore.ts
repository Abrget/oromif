import languages, { type Language } from "~/utils/local-languages";
import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type LanguageSlice = {
  language: Language;
  setLanguage: (newLanguage: Language) => void;
};

const spanishLanguageIndex = 2;

export const createLanguageSlice: BoundStateCreator<LanguageSlice> = (set) => ({
  language: languages[spanishLanguageIndex],
  setLanguage: (newLanguage: Language) => set({ language: newLanguage }),
});
