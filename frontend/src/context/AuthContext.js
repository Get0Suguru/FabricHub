import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  authFormState: 'Login', // Default value, will be overridden by the provider
  openAuthModal: () => {},  // Default no-op function to open the authentication modal
});

export const useAuth = () => useContext(AuthContext); 