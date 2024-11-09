import Header from "src/components/Header";
import PatientList from "src/components/PatientList";
import { useLocalization } from "src/contexts/Localization";

const CaregiverHomePage = () => {
  const { translate } = useLocalization();

  const patients = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">
        <h2 className="text-3xl font-bold mb-4">
          {translate("welcome", { name: "Caregiver" })}
        </h2>
        <PatientList patients={patients} />
      </main>
    </div>
  );
};

export default CaregiverHomePage;
