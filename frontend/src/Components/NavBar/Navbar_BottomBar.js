import React,{useState,useEffect} from 'react'
import styles from "./NavBar.module.css"
import { useSelector } from "react-redux"
import { getUser } from "../../features/User/UserSlice"
import NewPostModal from "./NewPostModal";
import { useNavigate } from "react-router-dom"
import { Avatar } from '@material-ui/core';
import home from "../../images/home1.svg"
import discover from "../../images/discover.svg"
import newPost from "../../images/newPost1.svg"
import feed from "../../images/feed.svg"

const BottomBar = () => {
    const current_user = useSelector(getUser)
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])
    return (
        <>
            {isOpen && <NewPostModal setIsOpen={setIsOpen} />}
            <div className={styles.bottombar_main_container}>
                <div className={styles.bottom_icon} onClick={() => navigate("/")}>
                    <img src={home}/>
                    </div>
                <div className={styles.bottom_icon}>
                <img src={discover}/>
                    </div>
                <div className={styles.bottom_icon} onClick={() => setIsOpen(true)}>
                <img src={newPost}/>
                    </div>
                <div className={styles.bottom_icon}>
                <img src={feed}/>
                    </div>
                <div className={styles.bottom_icon}>
                    <Avatar src={current_user.user && current_user.user.profileImageUrl} className={styles.bottombar_profile_pic} onClick={() => navigate("/" + current_user.user.userName)} />
                </div>
            </div>
        </>
    )
}

export default BottomBar