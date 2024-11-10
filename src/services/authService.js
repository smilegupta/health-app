import { Auth } from 'aws-amplify';

// Sign-in function
export const signIn = async (username, password) => {
  try {
    const user = await Auth.signIn(username, password);
    console.log('Sign-in successful:', user);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign-out function
export const signOut = async () => {
  try {
    await Auth.signOut();
    console.log('Sign-out successful');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
