export const boardReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BOARD":
      return [
        ...state,
        {
          id: action.payload.id,
          title: action.payload.title,
        },
      ];
    case "REMOVE_BOARD":
      return [...state.filter((board) => board.id !== action.payload.id)];
    case "EDIT_BOARD":
      return [
        ...state.map((board) => {
          if (board.id === action.payload.id) {
            board.title = action.payload.title;
          }
          return board;
        }),
      ];

    case "UPDATE_FROM_DB":
      return [...action.payload.data];
    default:
      return state;
  }
};

export const cardReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CARD":
      return [
        ...state,
        {
          bid: action.payload.bid,
          id: action.payload.id,
          title: action.payload.title,
        },
      ];
    case "REMOVE_CARD":
      return [...state.filter((card) => card.id !== action.payload.id)];
    case "EDIT_CARD":
      return [
        ...state.map((card) => {
          if (card.id === action.payload.id) {
            card.title = action.payload.title;
          }
          return card;
        }),
      ];

    case "MOVE_TO_BOARD":
      console.log("payload", action.payload);
      var tempArr = [
        ...state.map((card) => {
          if (card.id === action.payload.cid) {
            card.bid = action.payload.targetBoard;
          }
          return card;
        }),
      ];
      console.log("temp", tempArr);
      return tempArr;
    case "UPDATE_FROM_DB":
      return [...action.payload.data];
    default:
      state;
  }
};

//////////////////////
// case "MOVE_CARD":
//   var indexCid = state.findIndex((card) => card.id === action.payload.cid);
//   var indexTargetCid = state.findIndex(
//     (card) => card.id === action.payload.targetCard
//   );
//   var tempState = [...state];
//   var value = tempState[indexCid];

//   tempState.splice(indexCid, 1);

//   tempState.splice(indexTargetCid, 0, value);
//   return [
//     ...tempState.map((card) => {
//       if (card.id === action.payload.cid) {
//         card.bid = action.payload.targetBoard;
//       }
//       return card;
//     }),
//   ];
