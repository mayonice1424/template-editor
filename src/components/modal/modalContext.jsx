/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const NavContext = createContext();

export const ModalProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  console.log(visible)
  return (
    <NavContext.Provider value={{ visible, setVisible }}>
      {children}
    </NavContext.Provider>
  );
}

export const useModal = () => {
  return useContext(NavContext);
};
