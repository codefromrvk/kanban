import { useContext } from "react";
import { AppContext } from "../context/Context.jsx";

export const useAppContext = () => {
  return useContext(AppContext);
};
