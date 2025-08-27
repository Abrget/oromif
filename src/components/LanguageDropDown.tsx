import { ChevronDownSvg } from "./Svgs";
import { useState } from "react";
import languages from "~/utils/local-languages";
import { Flag } from "./Local-Flags";
import { useBoundStore } from "~/hooks/useBoundStore";
import { useTranslation } from "~/hooks/useTranslation";

export const LanguageDropDown = () => {
  const [languagesShown, setLanguagesShown] = useState(false);
  const { language: currentLanguage, setLanguage } = useBoundStore();
  const setCurrentLanguage = useBoundStore((x) => x.setCurrentLanguage);
  const t = useTranslation();

  return (
    <div
      className="relative hidden cursor-pointer items-center md:flex"
      onMouseEnter={() => setLanguagesShown(true)}
      onMouseLeave={() => setLanguagesShown(false)}
      aria-haspopup={true}
      aria-expanded={languagesShown}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setLanguagesShown((isShown) => !isShown);
        }
      }}
    >
      <span className="text-md uppercase">{t.header.siteLanguage}: {currentLanguage.nativeName}</span>{" "}
      <ChevronDownSvg />
      {languagesShown && (
        <ul className="absolute right-0 top-full grid w-[500px] grid-cols-2 rounded-2xl border-2 border-gray-200 bg-white p-6 font-light text-gray-600">
          {languages.map((language) => {
            return (
              <li key={language.code}>
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-3 whitespace-nowrap rounded-xl p-3 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    setCurrentLanguage(language);
                    setLanguagesShown(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setCurrentLanguage(language);
                      setLanguagesShown(false);
                    }
                  }}
                >
                  <Flag language={language} width={24} />
                  {language.nativeName}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
