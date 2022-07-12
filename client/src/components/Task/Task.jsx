import { useRef } from "react";
import { Card, Input } from "antd";
import { SaveOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./task.module.css";
import { useAppContext } from "../../hooks/useAppContext.jsx";

const Task = ({ id, title, bid, editTask, deleteTask }) => {
  const [edit, setEdit] = useState(false);
  const [taskValue, setTaskValue] = useState(title);

  const { target, setTarget } = useAppContext();
  const inputEl = useRef();

  const onButtonClick = () => {
    setEdit((prev) => !prev);
  };
  const handleEnter = (cid, bid) => {
    if (cid === target.id) return;
    setTarget({
      cid: cid,
      bid: bid,
    });
  };

  return (
    <>
      <Card
        draggable
        style={{
          cursor: "pointer",
          border: "1px solid #d1d0d0",
        }}
        onDragEnter={() => handleEnter(id, bid)}
        onDragStart={(e) => {
          e.dataTransfer.setData("Text", JSON.stringify({ id, bid, title }));
          console.log(JSON.stringify({ id, bid, title }));
        }}
        actions={
          edit
            ? [
                <SaveOutlined
                  key="save"
                  onClick={() => {
                    editTask(id, taskValue);
                    setEdit((prev) => !prev);
                  }}
                />,
              ]
            : [
                <EditOutlined key="edit" onClick={onButtonClick} />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => deleteTask(bid, id)}
                />,
              ]
        }
      >
        {edit ? (
          <input
            className={styles.input}
            value={taskValue}
            ref={inputEl}
            autoFocus={true}
            onChange={(e) => setTaskValue(e.target.value)}
          />
        ) : (
          <Input
            className={styles.input}
            value={title}
            ref={inputEl}
            disabled={!edit}
          />
        )}
      </Card>
    </>
  );
};

export default Task;
