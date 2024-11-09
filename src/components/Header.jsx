import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-blue-600 p-4 md:p-6 text-white shadow-md">
      <h1 className="text-3xl font-semibold tracking-wide hover:text-blue-200 transition duration-200 ease-in-out" aria-label="application Name">
        Meditrace
      </h1>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
