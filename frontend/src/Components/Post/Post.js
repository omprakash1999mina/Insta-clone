import { Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import "./Post.css";
//  import post_image from "../../images/post.jpg";
import notLiked from "../../images/notLiked.svg";
import liked from "../../images/redLove.svg";
import Comment from "../../images/comment.svg";
import share from "../../images/share.svg";
import { PostAuthRequest } from "../Post/authRequest"
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom"
import { time } from "./time"
const Post = (props) => {
    const [likeStatus, setLikeStatus] = useState(props.status);
    const [likeCount, setLikeCount] = useState(props.likes);
    const [commentCount, setCommentCount] = useState(props.commentCount)
    const [comment, setComment] = useState("")
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar();

    const changeLikesBackend = () => {
        const data = {
            "postId": props.postId,
            "status": !likeStatus
        }
        const successFunction = () => {
            if (likeStatus) {
                setLikeCount(likeCount - 1)
            } else {
                setLikeCount(likeCount + 1)
            }
            setLikeStatus(!likeStatus)
        }
        PostAuthRequest("api/post/likes", data, successFunction, enqueueSnackbar, navigate)
    }

    const changeLike = () => {
        changeLikesBackend();
    }

    const postComment = (e) => {
        e.preventDefault()
        const data = {
            "postId": props.postId,
            "comment": comment
        }
        const SuccessFxn = (response) => {
            enqueueSnackbar("Comment posted")
            setCommentCount(commentCount + 1)
        }
        PostAuthRequest("api/comment/create", data, SuccessFxn, enqueueSnackbar, navigate)
    }

    const shareHandler = () => {
        const url = process.env.REACT_APP_FRONTEND_URL+"p/"+props.slug;
        window.navigator.share({ url: url, text: "Hey !! checkout this post from Instagram . " })
      }
    return <div className="post_container">
        <div className="post_header">
            <Avatar className="post_image" src={props.profileimage} alt="image" onClick={() => navigate("/" + props.username)} />
            <div className="Post_username" onClick={() => navigate("/" + props.username)}>{props.username}</div>
        </div>
        <div>
            {props.postType === "image" && <img src={props.src}  alt="image1" className='post_image_file' />}
            {(props.postType === "video") &&
                <>
                    <video controls autoPlay muted className='post_image_file'>
                        <source src={props.src} width="470px" type="video/mp4" />
                        {/* <source src="movie.ogg" type="video/ogg" /> */}
                    </video>
                </>}

        </div>
        <div>
            <div style={{ "marginLeft": "10px" }}>
                <img src={(likeStatus) ? liked : notLiked} alt="imagei" className="post_reactimage" onClick={() => changeLike()}
                />
                <img src={Comment} alt="imagei" className="post_reactimage" onClick={() => navigate("/p/" + props.slug)} />
                <img src={share} alt="imagei" className="post_reactimage" onClick={() => shareHandler()}/>
            </div>
            <div className="post_like" >
                {likeCount} likes
            </div>
        </div>
        <div className="postCommentCount" onClick={() => navigate("/p/" + props.slug)}>
            {(commentCount > 0) ? "View all " + commentCount + " comments" : "Be the first to comment..."}
        </div>

        <div className="timeCount">
            <h1 className="time">{time(parseInt(Date.now() / 1000) - parseInt(props.createdAt))}</h1>
        </div>
        <form className="comment_container" onSubmit={(e)=>postComment(e)}>
            <input className="commentbox" type="text" placeholder="Add a comment..." onChange={(e) => setComment(e.target.value)} />
            {comment != "" ? <button className="post_comment" type="submit" >Post</button>
                : <button className="post_disabled" >Post</button>}

        </form>
    </div>
}

export default Post;