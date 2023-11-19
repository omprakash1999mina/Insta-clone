import React from "react";
import styles from "./styles.module.css";

const ChatItem = ({name,latestMessage}) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.left_container}>
          <div className={styles.avatar}>
            <img
              src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              alt="avatar"
              className={styles.avatar_img}
            />
          </div>
        </div>
        <div className={styles.right_container}>
          <div className={styles.info}>
            <div className={styles.name}>{name}</div>
            <div className={styles.msg}>{latestMessage}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatItem;
