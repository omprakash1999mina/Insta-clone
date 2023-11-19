import React from "react";
import styles from "./PostsPage.module.css";
import { Avatar } from "@material-ui/core";
import {useNavigate} from "react-router-dom"

const Comment = (props) => {
  const navigate = useNavigate()
  return (
    <>
      <div className={styles.comment_main_container}>
        <div className={styles.comment_image_container}>
          <Avatar
            className={styles.comment_profilePicture}
            src={props.profileImage}
            alt="image"
            onClick={()=>navigate("/"+props.userName)}
          />
        </div>
        <div className={styles.comment_comments_container}>
          <span className={styles.comment_username}>{props.userName}</span>
          <span className={styles.comment_text_container}>
            {" "}
            <span className={styles.comment_text}>{props.text}</span>
          </span>
        <div className={styles.comment_time}>{props.time}</div>
        </div>
      </div>
    </>
  );
};

export default Comment;
