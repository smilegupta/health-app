import { useState, useContext, createContext, useEffect } from "react";
import PropTypes from "prop-types";

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");
  const [translations, setTranslations] = useState({});

  const getLocalePath = (selectedLocale) => {
    return `/locales/${selectedLocale}.json`;
  };

  const loadTranslations = async (selectedLocale) => {
    try {
      const localePath = getLocalePath(selectedLocale);
      const response = await fetch(localePath);
      const localeData = await response.json();
      setTranslations(localeData);
    } catch (error) {
      console.error(`Error loading ${selectedLocale} locale`, error);
      // Fallback to English if locale not found or error occurs
      const fallbackPath = getLocalePath("en");
      const fallbackResponse = await fetch(fallbackPath);
      const fallbackData = await fallbackResponse.json();
      setTranslations(fallbackData);
    }
  };

  useEffect(() => {
    loadTranslations(locale); // Load translations on locale change
  }, [locale]);

  const translate = (key, vars = {}) => {
    let translation = translations[key] || key;

    Object.keys(vars).forEach((varKey) => {
      const placeholder = `{{${varKey}}}`;
      translation = translation.replace(
        new RegExp(placeholder, "g"),
        vars[varKey]
      );
    });

    return translation;
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, translate }}>
      {children}
    </LocalizationContext.Provider>
  );
};

LocalizationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};
