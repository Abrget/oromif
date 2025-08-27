export type LocalLanguage = (typeof locallanguages)[number];

const locallanguages = [
  
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
    name: "English",
    nativeName: "English",
    viewBox: "0 0 82 66",
    code: "en",
  },
  

 
 
] as const;

export default locallanguages;
