import React from "react";
import styles from "./uploadPhoto.module.css";
import { PostAuthRequest } from "../Post/authRequest";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { uploadFiles } from "./helper";

const UploadPhoto = ({ profileImageUrl, setIsOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const input = React.useRef();
  const removeImage = () => {
    const data = {
      oldImageUrl: profileImageUrl,
    };
    const successFxn = (response) => {
      window.location.reload();
      setIsOpen(false);
    };

    PostAuthRequest("api/user/removeProfilePic", data, successFxn, enqueueSnackbar, navigate);
  };

  const selectImage = () => {
    input.current.click();
  };
  const changeInput = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0] !== undefined) {
      const successFxn = (response) => {
        console.log(response);
        alert("success");
        setIsOpen(false);
        window.location.reload();
      };
      uploadFiles(e.target.files[0], profileImageUrl, enqueueSnackbar, navigate, successFxn);
      // setIsOpen(false)
    }
  };
  return (
    <>
      <div className={styles.dark_bg} onClick={() => setIsOpen(false)}></div>
      <div className={styles.main_container}>
        <div className={styles.modal}>
          <div className={styles.modal_header}>
            <img className={styles.image_profile} src={profileImageUrl} />
            <span className={styles.text_header}>Change Profile Photo</span>
          </div>
          <div className={styles.modal_content}>
            <div className={styles.modal_div}>
              <input
                className={styles.input_hidden}
                type="file"
                accept="image/*"
                ref={input}
                onChange={(e) => {
                  changeInput(e);
                }}
              />
              <h1
                className={`${styles.text} ${styles.blue}`}
                onClick={() => {
                  selectImage();
                }}
              >
                Upload Photo
              </h1>
            </div>
            <div className={styles.modal_div}>
              <h1
                className={`${styles.text} ${styles.red}`}
                onClick={() => {
                  removeImage();
                }}
              >
                Remove Current Photo
              </h1>
            </div>
            <div className={styles.modal_div}>
              <h1
                className={`${styles.text} ${styles.gray}`}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPhoto;
