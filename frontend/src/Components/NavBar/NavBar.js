import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import styles from "./NavBar.module.css";
import insta_logo from "../../images/logoinsta.png";
import NewPostModal from "./NewPostModal";
import { useEffect } from "react";
import { GetAuthRequest } from "../Post/authRequest";
import { useDispatch, useSelector } from "react-redux";
import { setUser, getUser } from "../../features/User/UserSlice";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { setLoading, getLoading } from "../../features/Loading/LoadingSlice";
import Loader from "../Loader/Loader";

function NavBar() {
  const dispatch = useDispatch();
  const current_user = useSelector(getUser);
  console.log(current_user)
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const loadingState = useSelector(getLoading);
  useEffect(() => {
    const SuccessFxn = (response) => {
      // console.log(response);
      dispatch(setUser(response.data.user));
    };
    if (!current_user.user) {
      GetAuthRequest("api/user/profile/isUser", SuccessFxn, enqueueSnackbar, navigate, dispatch);
    }
  }, []);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <NewPostModal setIsOpen={setIsOpen} />}
      {loadingState.loading && <Loader />}
      <div className={styles.navbar}>
        <div className={styles.main_container}>
          <div className={`${styles.icon} ${styles.small_screen}`}>
            <svg aria-label="New Story" class="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
              <circle cx="12" cy="13.191" fill="none" r="4.539" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></circle>
              <path
                d="M18.592 21.374A3.408 3.408 0 0022 17.966V8.874a3.41 3.41 0 00-3.41-3.409h-.52a2.108 2.108 0 01-1.954-1.375 2.082 2.082 0 00-2.204-1.348h-3.824A2.082 2.082 0 007.884 4.09 2.108 2.108 0 015.93 5.465h-.52A3.41 3.41 0 002 8.875v9.091a3.408 3.408 0 003.408 3.408z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </div>
          <div className={styles.logo_container}>
            <img
              className={styles.navbar_logo}
              src={insta_logo}
              alt="instalogo"
              width="105px"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
          <div className="search">
            <span className={styles.search_icon}>
              <svg aria-label="Search" class="_ab6-" color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16">
                <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
              </svg>
            </span>
            <input className={styles.navbar_searchbar} text="text" placeholder="Search" />
          </div>
          <div className={styles.icon_container}>
            <div className={styles.icon} onClick={() => navigate("/")}>
              <svg aria-label="Home" class="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </div>
            <div className={`${styles.icon} ${styles.alwaysVisible}`} onClick={()=>navigate("/message")}>
              <svg aria-label="Messenger" class="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path
                  d="M12.003 2.001a9.705 9.705 0 110 19.4 10.876 10.876 0 01-2.895-.384.798.798 0 00-.533.04l-1.984.876a.801.801 0 01-1.123-.708l-.054-1.78a.806.806 0 00-.27-.569 9.49 9.49 0 01-3.14-7.175 9.65 9.65 0 0110-9.7z"
                  fill="none"
                  stroke="currentColor"
                  stroke-miterlimit="10"
                  stroke-width="1.739"
                ></path>
                <path
                  d="M17.79 10.132a.659.659 0 00-.962-.873l-2.556 2.05a.63.63 0 01-.758.002L11.06 9.47a1.576 1.576 0 00-2.277.42l-2.567 3.98a.659.659 0 00.961.875l2.556-2.049a.63.63 0 01.759-.002l2.452 1.84a1.576 1.576 0 002.278-.42z"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div className={styles.icon} onClick={() => setIsOpen(true)}>
              <svg aria-label="New post" class="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path
                  d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line>
                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
              </svg>
            </div>
            <div className={styles.icon}>
              <svg aria-label="Find People" class="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
                <polygon fill-rule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon>
                <circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
              </svg>
            </div>
            <div className={styles.icon}>
              <svg aria-label="Activity Feed" class="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
                <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
              </svg>
            </div>
            <div className={styles.icon}>
              <Avatar className={styles.profile_pic} src={current_user.user && current_user.user.profileImageUrl} onClick={() => navigate("/" + current_user.user.userName)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
