import { useUser } from 'src/contexts/UserContext';
import AdminHomePage from 'src/routes/AdminHomePage';
import CaregiverHomePage from 'src/routes/CaregiverHomePage';

function App() {
  const { user } = useUser();

  // Render based on the user type
  return (
    <>
      {user?.['custom:userType'] === '1' ? (
        <AdminHomePage />
      ) : (
        <CaregiverHomePage />
      )}
    </>
  );
}

export default App;
