import { useLocalization } from "src/contexts/Localization";
import LanguageSwitcher from "src/components/LanguageSwitcher";

function App() {
  const { translate } = useLocalization();
  return (
    <>
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold underline text-[red]">
        {translate("add_participant")}
      </h1>
    </>
  );
}

export default App;
