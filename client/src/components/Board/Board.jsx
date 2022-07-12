import { Button, Input } from "antd";
import {
  EllipsisOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";

import Task from "../Task/Task.jsx";
import { useAppContext } from "../../hooks/useAppContext.jsx";
import styles from "./board.module.css";
import { useState } from "react";
import axios from "../../api/axios.js";

const Board = ({ id, title, deleteBoard, editBoard }) => {
  const [toggle, setToggle] = useState(false);
  const [toggleEditInput, setToggleEditInput] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [task, setTask] = useState("");
  const [editInput, setEditInput] = useState("");
  const { cardState, cardDispatch } = useAppContext();

  const addTask = async () => {
    if (!task) {
      alert("Please add a task name");
      return;
    }
    try {
      const response = await axios.post("/api/cards", {
        bid: id,
        id: parseInt(Date.now() * Math.random()),
        title: task,
      });
      console.log(response.data.data);
      cardDispatch({
        type: "ADD_CARD",
        payload: {
          bid: response.data.data.bid,
          id: response.data.data.id,
          title: response.data.data.title,
        },
      });
    } catch (error) {
      console.log(error);
    }
    setTask("");
    setToggle((prev) => !prev);
  };
  const deleteTask = async (bid, id) => {
    try {
      const response = await axios.delete(`/api/cards/${id}`);
      console.log(response.data.data);
      cardDispatch({
        type: "REMOVE_CARD",
        payload: {
          id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const editTask = async (cid, data) => {
    try {
      const response = await axios.patch(`/api/cards/${cid}`, {
        title: data,
      });
      console.log("editing", response.data.data);
      cardDispatch({
        type: "EDIT_CARD",
        payload: {
          id: response.data.data.id,
          title: response.data.data.title,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    console.log("DROP", id, title);
    var data = JSON.parse(e.dataTransfer.getData("Text"));
    console.log("the card data", data);
    if (data.bid === id) return;
    try {
      const response = await axios.post(`/api/cards/${data.id}`, {
        bid: id,
      });
      console.log("moving", response.data);
      cardDispatch({
        type: "MOVE_TO_BOARD",
        payload: {
          cid: response.data.data.id,
          bid: data.bid,
          targetBoard: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.board}>
      <div className={styles.board_header}>
        {toggleEditInput ? (
          <div className={styles.edit_input}>
            <input
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
            />
            <Button
              onClick={() => {
                setToggleEditInput((prev) => !prev);
                editBoard(id, editInput);
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setToggleEditInput((prev) => !prev);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <span>{title}</span>
        )}
        <div className={styles.option_card_wrapper}>
          {moreOptions ? (
            <CloseOutlined
              style={{ fontSize: "15px", cursor: "pointer" }}
              onClick={() => setMoreOptions((prev) => !prev)}
            />
          ) : (
            <EllipsisOutlined onClick={() => setMoreOptions((prev) => !prev)} />
          )}
          {moreOptions && (
            <div className={styles.option_card}>
              <Button onClick={() => deleteBoard(id)}>
                Delete
                <DeleteOutlined />
              </Button>
              <Button
                style={{ width: "100%" }}
                onClick={() => {
                  setMoreOptions((prev) => !prev);
                  setToggleEditInput((prev) => !prev);
                }}
              >
                Edit
                <EditOutlined />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div
        className={styles.board_body}
        onDragEnd={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        {cardState.map((card) => {
          if (card.bid === id) {
            return (
              <Task
                key={card.id}
                id={card.id}
                title={card.title}
                bid={id}
                deleteTask={deleteTask}
                editTask={editTask}
              />
            );
          }
        })}

        {toggle ? (
          <div>
            <Input
              placeholder="Enter task"
              value={task}
              onInput={(e) => {
                setTask(e.target.value);
              }}
            />
            <div className={styles.btn_div}>
              <Button onClick={addTask}>Save</Button>
              <Button
                onClick={() => {
                  setTask("");
                  setToggle((prev) => !prev);
                  // setMoreOptions((prev) => !prev);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setToggle((prev) => !prev)}>Add card</Button>
        )}
      </div>
    </div>
  );
};

export default Board;
