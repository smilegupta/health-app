import { Link } from "react-router-dom";

// ui imports
import LanguageSwitcher from "src/components/LanguageSwitcher";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-blue-600 p-4 md:p-6 text-white shadow-md">
      <Link to="/">
        <h1
          className="text-3xl font-semibold tracking-wide hover:text-blue-200"
          aria-label="application name - meditrace"
        >
          Meditrace
        </h1>
      </Link>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
