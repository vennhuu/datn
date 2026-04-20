import { createContext, useContext, useState } from "react";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("vi"); // "vi" | "en"
  const toggleLang = () => setLang((prev) => (prev === "vi" ? "en" : "vi"));

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);