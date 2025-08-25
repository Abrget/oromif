export type Language = (typeof languages)[number];

const languages = [
  
  {
    name: "Oromo",
    nativeName: "Oromiya",
    viewBox: "0 1584 82 66",
    code: "or",
  },
  {
    name: "Amharic",
    nativeName: "አማርኛ",
    viewBox: "0 1650 82 66",
    code: "am",
  },
  {
    name: "Italian",
    nativeName: "Italiano",
    viewBox: "0 330 82 66",
    code: "it",
  },
  
  
  
  { name: "Turkish", nativeName: "Türkçe", viewBox: "0 660 82 66", code: "tr" },
  {
    name: "Ukrainian",
    nativeName: "Українською",
    viewBox: "0 1716 82 66",
    code: "uk",
  },
  {
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    viewBox: "0 1188 82 66",
    code: "vi",
  },
  {
    name: "Chinese",
    nativeName: "中文",
    viewBox: "0 462 82 66",
    code: "code-CN",
  },
] as const;

export default languages;
