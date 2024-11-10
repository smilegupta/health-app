import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Auth } from "aws-amplify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        /**
         * sample currentUser.attributes
         {
          "email": "jimmy@abc.com",
          "email_verified": true,
          "name": "Jimmy",
          "custom:userType": "2", // 1 - admin, 2 - patient login
          "sub": "81e32dea-60e1-709c-12e5-a67e5118b0d8"
          }
         */
        setUser(currentUser.attributes);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a userProvider");
  }
  return context;
};
