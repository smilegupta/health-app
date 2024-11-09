import { useLocalization } from "src/contexts/Localization";

const LanguageSwitcher = () => {
  const { setLocale } = useLocalization();

  return (
    <select onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
};

export default LanguageSwitcher;
