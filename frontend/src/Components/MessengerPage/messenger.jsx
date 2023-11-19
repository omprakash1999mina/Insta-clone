import React from "react";
import NavBar from "../NavBar/NavBar";
import styles from "./styles.module.css";
import ChatItem from "./ChatItem/chatItem";

const Messenger = () => {
  return (
    <>
      <NavBar />
      <div className={styles.main_container}>
        <div className={styles.container}>
          <div className={styles.left_container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Messenger</h1>
            </div>
            <div className={styles.body_container}>
                {/* <Chat/> */}
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
                <ChatItem name="Devansh" latestMessage={"Hi how are you"}/>
            </div>
          </div>
          <div className={styles.right_container}></div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
