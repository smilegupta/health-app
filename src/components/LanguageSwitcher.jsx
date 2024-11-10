import { useLocalization } from "src/contexts/Localization";

const LanguageSwitcher = () => {
  const { setLocale, locale } = useLocalization();

  return (
    <div className="relative">
      <select
        onChange={(e) => setLocale(e.target.value)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md focus:outline-none appearance-none focus:ring-2 focus:ring-white hover:bg-blue-400 pr-8"
        aria-label="Language Selector"
        value={locale}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
