import { createContext, useContext, useState } from 'react';

const NavContext = createContext();

export const LoginProvider = ({ children }) => {
  const [ popup, setPopup] = useState(true);
  return (
    <NavContext.Provider value={{ popup, setPopup }}>
      {children}
    </NavContext.Provider>
  );
}

export const useLogin = () => {
  return useContext(NavContext);
};
