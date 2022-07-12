import { useEffect, useState } from "react";
import { createContext, useReducer } from "react";
import axios from "../api/axios.js";
import { boardReducer, cardReducer } from "./Reducer.jsx";

//Four default sections - Backlogs, Planned, In Progress and Completed.

const defaultBoards = [];
let defaultCards = [];

export const AppContext = createContext();

const AppProvider = (props) => {
  const [boardState, boardDispatch] = useReducer(boardReducer, defaultBoards);
  const [cardState, cardDispatch] = useReducer(cardReducer, defaultCards);
  const [target, setTarget] = useState({
    id: "",
    bid: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get("/api/boards");
        const response2 = await axios.get("/api/cards");
        boardDispatch({
          type: "UPDATE_FROM_DB",
          payload: { data: response1.data.data },
        });
        cardDispatch({
          type: "UPDATE_FROM_DB",
          payload: { data: response2.data.data },
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        boardState,
        boardDispatch,
        cardState,
        cardDispatch,
        target,
        setTarget,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
