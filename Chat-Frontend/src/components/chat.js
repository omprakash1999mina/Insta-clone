import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import { io } from "socket.io-client";

const END_POINT = 'http://localhost:5000'
var socket,selectedChatCompare
const Chat = () => {
  const [message, setMessages] = useState([]);
  const [input,setInput]= useState("")
  const function1 = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer "+localStorage.getItem("refresh_token"),
      },
    };
    axios.get("http://localhost:5000/api/message/64e4bebf6a33933a0c15e9d0", config).then((res) => {
      setMessages(res.data.data);
    });
  };

  const sendMessage = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer "+localStorage.getItem("refresh_token"),
      },
    };
    const data = {
      chat: "64e4bebf6a33933a0c15e9d0",
      content: input,
    };
    axios.post("http://localhost:5000/api/message",data, config).then((res) => {
      alert("message sent")
    });
  };

  useEffect(() => {
    socket = io(END_POINT)
    function1();
  }, []);
  return (
    <>
      <div className={styles.mainContainer}>
        {message.map((ele) => {
          return (
            <>
              {"Sender = " + ele.sender.name}
              <br />
              {"Message = " + ele.content}
              <br />
              --------------------------------------------------------------
              <br />
            </>
          );
        })}
      </div>
      <input type="text" className={styles.text} onChange={(e)=>setInput(e.target.value)} />
      <button className={styles.send} onClick={()=>sendMessage()}>Send</button>
    </>
  );
};

export default Chat;
