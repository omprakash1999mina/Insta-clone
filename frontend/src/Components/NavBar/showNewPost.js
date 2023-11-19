import React from "react";
import styles from "./NewPostModal.module.css";
import { uploadFiles } from "./helper"
import { useNavigate } from "react-router-dom"
import { useSnackbar } from 'notistack';
import { useDispatch } from "react-redux"

const ShowNewPostModal = ({ setNewPostViewOpen, file }) => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const sharePost = () => {
        const successFxn = (response) => {
            console.log(response)
            alert("Post created successfully")
            setNewPostViewOpen(false)
        }
        uploadFiles(file, file.type.split("/")[0], successFxn, enqueueSnackbar, navigate, dispatch)
    }


    return (
        <>
            <div className={styles.darkBG} onClick={() => setNewPostViewOpen(false)} />
            <button className={styles.closeBtn} onClick={() => setNewPostViewOpen(false)}>
                <svg
                    aria-label="Close"
                    class="fg7vo5n6 lrzqjn8y"
                    color="#ffffff"
                    fill="#ffffff"
                    height="18"
                    role="img"
                    viewBox="0 0 48 48"
                    width="18"
                >
                    <title>Close</title>
                    <path
                        clip-rule="evenodd"
                        d="M41.8 9.8L27.5 24l14.2 14.2c.6.6.6 1.5 0 2.1l-1.4 1.4c-.6.6-1.5.6-2.1 0L24 27.5 9.8 41.8c-.6.6-1.5.6-2.1 0l-1.4-1.4c-.6-.6-.6-1.5 0-2.1L20.5 24 6.2 9.8c-.6-.6-.6-1.5 0-2.1l1.4-1.4c.6-.6 1.5-.6 2.1 0L24 20.5 38.3 6.2c.6-.6 1.5-.6 2.1 0l1.4 1.4c.6.6.6 1.6 0 2.2z"
                        fill-rule="evenodd"
                    ></path>
                </svg>
            </button>
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader_show}>
                        <h5 className={styles.heading}>Create New Post</h5>
                        <h5 className={styles.share_btn} onClick={() => sharePost()}>Share</h5>
                    </div>
                    <div className={styles.modalContainer} style={{ height: "326px" }}>
                        {(file.type.split("/")[0] === "image") && <img src={URL.createObjectURL(file)} className={styles.imgPreview} alt="postimage" />}
                        {(file.type.split("/")[0] === "video") &&
                            <>
                                <video width="320" height="240" controls className={styles.imgPreview}>
                                    <source src={URL.createObjectURL(file)} type={file.type} />
                                    {/* <source src="movie.ogg" type="video/ogg" /> */}
                                </video>
                            </>}

                    </div>
                </div>{" "}
            </div>
        </>
    );
};

export default ShowNewPostModal;
