import styles from "./app.module.css";
import { useState } from "react";
import { useAppContext } from "./hooks/useAppContext.jsx";
import { Layout, Button, Input } from "antd";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import Board from "./components/Board/Board.jsx";
import axios from "./api/axios";

const { Header, Footer } = Layout;

function App() {
  const [boardTitle, setBoardTitle] = useState("");
  const [addBoardCard, setAddBoardCard] = useState(false);
  const { boardState, boardDispatch } = useAppContext();

  const addBoard = async () => {
    if (!boardTitle) {
      alert("Please add a board name");
      return;
    }
    try {
      const response = await axios.post(`/api/boards`, {
        id: parseInt(Date.now() * Math.random()),
        title: boardTitle,
      });
      boardDispatch({
        type: "ADD_BOARD",
        payload: { id: response.data.data.id, title: response.data.data.title },
      });
      setBoardTitle("");
      setAddBoardCard((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBoard = async (id) => {
    try {
      const response = await axios.delete(`/api/boards/${id}`);
      console.log(response.data.data);
      boardDispatch({
        type: "REMOVE_BOARD",
        payload: {
          id: response.data.data.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const editBoard = async (id, data) => {
    try {
      const response = await axios.patch(`/api/boards/${id}`, {
        title: data,
      });
      boardDispatch({
        type: "EDIT_BOARD",
        payload: {
          id: response.data.data.id,
          title: response.data.data.title,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Header>
        <h1 className={styles.title}>Kanban✍️</h1>
      </Header>
      <div className={styles.board_list}>
        {boardState.map((board) => {
          return (
            <Board
              key={board.id}
              id={board.id}
              title={board.title}
              deleteBoard={deleteBoard}
              editBoard={editBoard}
            />
          );
        })}
        <div className={styles.default_board}>
          {addBoardCard ? (
            <>
              <Input
                value={boardTitle}
                onInput={(e) => setBoardTitle(e.target.value)}
              />
              <div className={styles.btn_div}>
                <Button onClick={addBoard}>Save</Button>
                <Button
                  onClick={() => {
                    setAddBoardCard((prev) => !prev);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Button
              className={styles.add_board_btn}
              onClick={() => {
                setAddBoardCard((prev) => !prev);
              }}
            >
              Add Board
            </Button>
          )}
        </div>
      </div>
      <Footer>
        <div className={styles.footer}>
          @rvk designs{" "}
          <GithubOutlined
            style={{ margin: "10px", cursor: "pointer", fontSize: "20px" }}
          />
          <TwitterOutlined
            style={{ margin: "10px", cursor: "pointer", fontSize: "20px" }}
          />
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
