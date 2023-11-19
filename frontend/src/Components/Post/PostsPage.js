import React, { useState, useEffect, useRef } from 'react'
import styles from './PostsPage.module.css'
import { PostAuthRequest, GetAuthRequest } from "./authRequest"
import { time } from './time';
import notLiked from "../../images/notLiked.svg";
import liked from "../../images/redLove.svg";
import CommentIcon from "../../images/comment.svg";
import share from "../../images/share.svg";
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from "react-router-dom"
import { Avatar } from '@material-ui/core';
import Comment from "./Comment"
import Navbar from "../NavBar/NavBar"
import BottomBar from "../NavBar/Navbar_BottomBar"
import { useDispatch, useSelector } from "react-redux"

const PostsPage = () => {
  const params = useParams()
  const slug = params.postSlug
  const [post, setPost] = useState({})
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0)
  const [comment, setComment] = useState("")
  const [commentArray, setCommentArray] = useState([])
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
  const commentBox = useRef()
  const commentBox_large = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    const successFunction = (response) => {
      console.log(response)
      setPost(response.data.post)
      setLikeCount(response.data.post.postLikesCount)
      setLikeStatus(response.data.post.status)
      setCommentCount(response.data.post.postComments.length)
      setCommentArray(response.data.post.postComments)
    }
    GetAuthRequest("api/post/get?slug=" + slug, successFunction, enqueueSnackbar, navigate, dispatch)
  }, [])

  const changeLikesBackend = () => {
    const data = {
      "postId": post.postId,
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

  const postComment = () => {
    const data = {
      "postId": post.postId,
      "comment": comment
    }
    const SuccessFxn = (response) => {
      enqueueSnackbar("Comment posted")
      console.log(response);
      setCommentArray([...commentArray, response.data.comment])
      setCommentCount(commentCount + 1)
      commentBox.current.value = ""
      commentBox_large.current.value = ""
    }
    PostAuthRequest("api/comment/create", data, SuccessFxn, enqueueSnackbar, navigate)
  }

  const shareHandler = () => {
    const url = window.location.href;
    window.navigator.share({ url: url, text: "Hey !! checkout this post from Instagram . " })
  }

  return (

    <>
      <Navbar />
      <BottomBar />
      <div className={styles.main_container}>
        <div className={styles.main}>
          <div className={styles.container}>
            <div className={styles.left_container}>
              <div className={styles.img_container}>
                {(post && post.postType === "image") && <img src={post.postFileUrl} alt="image1" className={styles.post_image_file} />}
                {(post && post.postType === "video") &&
                  <>
                    <video className={styles.post_image_file} controls autoPlay muted style={{ border: "none", outline: "none" }}>
                      <source src={post.postFileUrl} type="video/mp4" />
                    </video>
                  </>}

              </div>
            </div>
            <div className={styles.right_container}>
              <div className={styles.header}>
                <Avatar className={styles.profilePicture} src={post.profileImage} alt="image"
                  onClick={() => navigate("/" + post.userName)}
                />
                <div className={styles.post_username}
                  onClick={() => navigate("/" + post.userName)}
                >{post.userName}</div>
              </div>
              <div className={styles.comments}>
                {(commentArray && commentArray.length > 0) ? commentArray.slice(0).reverse().map((e, i) => {
                  return <Comment key={e.id} userName={e.commentorUserName} text={e.text} time={time(parseInt(Date.now() / 1000) - parseInt((e.createdAt) / 1000))} profileImage={e.profileImage} />
                }) : (<div className={styles.noCommentDiv}><h1 className={styles.heading_no_comment}>No comment yet</h1>
                  <p className={styles.text_no_comment}>Start the conversation</p></div>)}
              </div>
              <div>
                <div style={{ "marginLeft": "10px" }}>
                  <img src={(likeStatus) ? liked : notLiked} alt="imagei" className={styles.post_reactimage} onClick={() => changeLike()}
                  />
                  <img src={CommentIcon} alt="imagei" className={styles.post_reactimage} onClick={() => commentBox_large.current.focus()} />
                  <img src={share} alt="imagei" className={styles.post_reactimage} onClick={() => shareHandler()} />
                </div>
                <div className={styles.post_like}>
                  {likeCount} likes
                </div>

                <div className={styles.postCommentCount}>
                  {(commentCount > 0) ? "View all " + commentCount + " comments" : "Be the first to comment..."}
                </div>

                <div className={styles.timeCount}>
                  <h1 className={styles.time}>{time(parseInt(Date.now() / 1000) - parseInt(post.createdAt))}</h1>
                </div>
                <div className={styles.comment_container}>
                  <input className={styles.commentbox} type="text" placeholder="Add a comment..." ref={commentBox_large} onChange={(e) => setComment(e.target.value)} />
                  {comment != "" ? <button className={styles.post_comment} onClick={() => { postComment() }}>Post</button>
                    : <button className={styles.post_disabled} >Post</button>}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* For small screen */}

      <div className={`${styles.main_container} ${styles.small_screen}`}>
        <div className={styles.main}>
          <div className={styles.header}>
            <Avatar className={styles.profilePicture} src={post.profileImage} alt="image"
              onClick={() => navigate("/" + post.userName)}
            />
            <div className={styles.post_username}
              onClick={() => navigate("/" + post.userName)}
            >{post.userName}</div>
          </div>
          <div className={styles.img_container}>
            {(post && post.postType === "image") && <img src={post.postFileUrl} width="478px" alt="image1" className={styles.post_image_file} />}
            {(post && post.postType === "video") &&
              <>
                <video width="478px" controls autoPlay muted className={styles.post_image_file}>
                  <source src={post.postFileUrl} width="478px" type="video/mp4" />
                </video>
              </>}
          </div>
          <div className={styles.icons_container}>
            <div style={{ "marginLeft": "10px" }}>
              <img src={(likeStatus) ? liked : notLiked} alt="imagei" className={styles.post_reactimage} onClick={() => changeLike()}
              />
              <img src={CommentIcon} alt="imagei" className={styles.post_reactimage} onClick={() => commentBox.current.focus()} />
              <img src={share} alt="imagei" className={styles.post_reactimage} onClick={() => shareHandler()} />
            </div>
            <div className={styles.post_like}>
              {likeCount} likes
            </div>

            <div className={styles.postCommentCount}>
              {(commentCount > 0) ? "View all " + commentCount + " comments" : "Be the first to comment..."}
            </div>

            <div className={styles.timeCount}>
              <h1 className={styles.time}>{time(parseInt(Date.now() / 1000) - parseInt(post.createdAt))}</h1>
            </div>
            <div className={styles.comment_container}>
              <input className={styles.commentbox} type="text" placeholder="Add a comment..." ref={commentBox} onChange={(e) => setComment(e.target.value)} />
              {comment != "" ? <button className={styles.post_comment} onClick={() => { postComment() }}>Post</button>
                : <button className={styles.post_disabled} >Post</button>}

            </div>
          </div>


          <div className={styles.comments}>
            {(commentArray && commentArray.length > 0) ? commentArray.slice(0).reverse().map((e, i) => {
              return <Comment key={e.id} userName={e.commentorUserName} text={e.text} time={time(parseInt(Date.now() / 1000) - parseInt((e.createdAt) / 1000))} profileImage={e.profileImage} />
            }) : (<div className={styles.noCommentDiv}><h1 className={styles.heading_no_comment}>No comment yet</h1>
              <p className={styles.text_no_comment}>Start the conversation</p></div>)}
          </div>


        </div>
      </div>
    </>
  )
}

export default PostsPage