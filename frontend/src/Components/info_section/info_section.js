import { Avatar } from "@material-ui/core";
import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { getUser } from "../../features/User/UserSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
// import "./InfoSection.css";
import styles from "./styles.module.css";
const InfoSection = () => {
  const current_user = useSelector(getUser);
  const navigate = useNavigate();
  const enqueueSnackbar = useSnackbar();
  console.log(current_user);

  const logoutHandler = () => {
    const data = {
      refresh_token: localStorage.getItem("refresh_token"),
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization":"Bearer " + localStorage.getItem("access_token"),
      },
      withCredentials: true
    };
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "api/user/logout", data, config)
      .then((response) => {
        localStorage.clear();
        navigate("/login");
        enqueueSnackbar("Logged out successfully", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.log(error)
        // localStorage.clear();
        // navigate("/login");
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Avatar
          className={styles.image}
          src={current_user.user && current_user.user.profileImageUrl}
        />
        <div className={styles.gyaan}>
          <div
            style={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/" + current_user.user.userName)}
          >
            {current_user.user && current_user.user.userName}
          </div>
          <div>{current_user.user && current_user.user.full_name}</div>
        </div>
      </div>
      <div className={styles.right}>
        <button
          type="button"
          className={styles.btn_logout}
          onClick={() => logoutHandler()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default InfoSection;
