import languages, { type Language } from "~/utils/languages";
import currnetLanguage,{ type LocalLanguage } from "~/utils/local-languages";
import type { BoundStateCreator } from "~/hooks/useBoundStore";


export type LanguageSlice = {
  language: Language;
  currentlanguage: LocalLanguage;
  setLanguage: (newLanguage: Language) => void;
  setCurrentLanguage: (localLanguages: LocalLanguage) => void;
 
};

const oromoLanguageIndex = 0;

export const createLanguageSlice: BoundStateCreator<LanguageSlice> = (set) => ({
  language: languages[oromoLanguageIndex],
  currentlanguage: currnetLanguage[2],
    setLanguage: (newLanguage: Language) => set({ language: newLanguage }),
    setCurrentLanguage: (localLanguages: LocalLanguage) => set({ currentlanguage: localLanguages }),
});
