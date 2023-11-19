import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import avatar from "../../images/pp1.png";
import styles from "./userProfile.module.css";
import { GetAuthRequest, PostAuthRequest } from "../Post/authRequest";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { AiTwotoneSetting } from "react-icons/ai";
import { BsThreeDots, BsCamera } from "react-icons/bs";
import NavBar from "../NavBar/NavBar";
import UploadPhoto from "./uploadPhoto";
import { uploadFiles } from "./helper";
import BottomBar from "../NavBar/Navbar_BottomBar";
import { useDispatch, useSelector } from "react-redux";

const UserProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const userName = params.userName;

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [nextToken, setNextToken] = useState(0);
  const [followStatus, setFollowStatus] = useState(userProfile.follow_by_viewer);
  const image_Input = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const SuccessFxn_profile = (response) => {
      setUserProfile(response.data.user);
      setFollowStatus(response.data.user.follow_by_viewer);
      setFollowersCount(response.data.user.followers.length);
      console.log(response);
    };
    const SuccessFxn_posts = (response) => {
      setUserPosts(response.data.posts);
      console.log(response.data.posts);
    };

    GetAuthRequest("api/user/profile?userName=" + userName, SuccessFxn_profile, enqueueSnackbar, navigate, dispatch);
    GetAuthRequest("api/post/reels_tray?userName=" + userName + "&size=12&nextToken=" + nextToken, SuccessFxn_posts, enqueueSnackbar, navigate, dispatch);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const selectImage = () => {
    image_Input.current.click();
  };
  const changeInput = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0] !== undefined) {
      const successFxn = (response) => {
        console.log(response);
        alert("success");
        window.location.reload();
      };
      uploadFiles(e.target.files[0], " ", enqueueSnackbar, navigate, successFxn);
      // setIsOpen(false)
    }
  };

  const onFollowClicked = () => {
    if (followStatus) {
      const data = {
        followUserId: userProfile.id,
        status: false,
      };
      const SuccessFxn = (response) => {
        setFollowStatus(false);
        setFollowersCount(followersCount - 1);
      };
      PostAuthRequest("api/user/follow", data, SuccessFxn, enqueueSnackbar, navigate);
    } else {
      const data = {
        followUserId: userProfile.id,
        status: true,
      };

      const SuccessFxn = (response) => {
        setFollowStatus(true);
        setFollowersCount(followersCount + 1);
      };
      PostAuthRequest("api/user/follow", data, SuccessFxn, enqueueSnackbar, navigate);
    }
  };
  return (
    <>
      <Helmet>
        <title>{`${userProfile && userProfile.full_name} (@${userProfile && userProfile.userName}) . Instagram photos and videos`}</title>
      </Helmet>
      <NavBar />
      <div className={styles.main_container}>
        <div className={styles.main}>
          <header className={styles.profile_container}>
            <div className={styles.left_container}>
              <div className={styles.image_container}>
                <input type="file" className={styles.hidden_input} ref={image_Input} onChange={(e) => changeInput(e)} accept="image/*" />
                {userProfile && userProfile.profileImageUrl == "" && userProfile.user_is_Viewer && <img src={avatar} className={styles.image_profile} onClick={() => selectImage()} />}
                {userProfile && userProfile.profileImageUrl != "" && userProfile.user_is_Viewer && <img src={userProfile.profileImageUrl} className={styles.image_profile} onClick={() => setIsOpen(true)} />}
                {userProfile && userProfile.profileImageUrl == "" && !userProfile.user_is_Viewer && <img src={avatar} className={styles.image_profile} />}
                {userProfile && userProfile.profileImageUrl != "" && !userProfile.user_is_Viewer && <img src={userProfile.profileImageUrl} className={styles.image_profile} />}
              </div>
            </div>
            <div className={styles.right_container}>
              <div className={styles.top_section}>
                <div className={styles.username_container}>
                  <h1 className={styles.username}>{userProfile && userProfile.userName}</h1>
                </div>
                {userProfile && userProfile.user_is_Viewer ? (
                  <>
                    <div className={styles.edit_container}>
                      <button className={styles.edit_button}>Edit Profile</button>
                    </div>
                    <div className={styles.setting_container}>
                      <AiTwotoneSetting fontSize="30px" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.follow_container}>
                      {!followStatus && (
                        <button className={styles.follow_btn} onClick={() => onFollowClicked()}>
                          Follow
                        </button>
                      )}
                      {followStatus && (
                        <button className={styles.edit_button} onClick={() => onFollowClicked()}>
                          Following
                        </button>
                      )}
                    </div>
                    <div className={styles.setting_container}>
                      <BsThreeDots fontSize="30px" />
                    </div>
                  </>
                )}
              </div>
              <div className={styles.middle_section}>
                <div className={styles.post_counters_container}>
                  <span className={styles.count}>{userProfile && userProfile.postCount}</span>
                  <span className={styles.text}>posts</span>
                </div>
                <div className={styles.post_counters_container}>
                  <span className={styles.count}>{userProfile && userProfile.followers ? followersCount : "0"}</span>
                  <span className={styles.text}>followers</span>
                </div>
                <div className={styles.post_counters_container}>
                  <span className={styles.count}>{userProfile && userProfile.following ? userProfile.following.length : "0"}</span>
                  <span className={styles.text}>followings</span>
                </div>
              </div>
              <div className={styles.bottom_section}>
                <div className={styles.name_container}>
                  <div className={styles.name}>{userProfile && userProfile.full_name}</div>
                  <div className={styles.bio_container}>
                    IIT BHU VARANSI
                    <br /> INDIAN
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className={styles.middle_section_small_screen}>
            <div className={styles.post_counters_container_small_screen}>
              <span className={styles.count_small_screen}>{userProfile && userProfile.postCount}</span>
              <span className={styles.text_small_screen}>posts</span>
            </div>
            <div className={styles.post_counters_container_small_screen}>
              <span className={styles.count_small_screen}>{userProfile && userProfile.followers ? userProfile.followers.length : "0"}</span>
              <span className={styles.text_small_screen}>followers</span>
            </div>
            <div className={styles.post_counters_container_small_screen}>
              <span className={styles.count_small_screen}>{userProfile && userProfile.following ? userProfile.following.length : "0"}</span>
              <span className={styles.text_small_screen}>followings</span>
            </div>
          </div>
          <div className={styles.middle_container}>
            <div className={styles.option_div}>
              <span className={styles.icon}>
                <svg aria-label="" class="_ab6-" color="#262626" fill="#262626" height="12" role="img" viewBox="0 0 24 24" width="12">
                  <rect fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"></rect>
                  <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                  <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                  <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                  <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                </svg>
              </span>
              <div className={styles.option_name}>POSTS</div>
            </div>
            {userProfile && userProfile.user_is_Viewer && (
              <div className={styles.option_div}>
                <span className={styles.icon}>
                  <svg aria-label="" class="_ab6-" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12">
                    <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
                  </svg>
                </span>
                <div className={styles.option_name}>SAVED</div>
              </div>
            )}
            <div className={styles.option_div}>
              <span className={styles.icon}>
                <svg aria-label="" class="_ab6-" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12">
                  <path
                    d="M10.201 3.797L12 1.997l1.799 1.8a1.59 1.59 0 001.124.465h5.259A1.818 1.818 0 0122 6.08v14.104a1.818 1.818 0 01-1.818 1.818H3.818A1.818 1.818 0 012 20.184V6.08a1.818 1.818 0 011.818-1.818h5.26a1.59 1.59 0 001.123-.465z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                  <path d="M18.598 22.002V21.4a3.949 3.949 0 00-3.948-3.949H9.495A3.949 3.949 0 005.546 21.4v.603" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  <circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                </svg>
              </span>
              <div className={styles.option_name}>TAGGED</div>
            </div>
          </div>
          {userPosts.length > 0 ? (
            userPosts.map((post, index) => {
              if (index % 3 == 0) {
                return (
                  <div className={styles.reels_tray_container}>
                    <div className={styles.reel_rectangle}>
                      {index < userPosts.length ? (
                        userPosts[index].postType === "image" ? (
                          <>
                            <img src={userPosts[index].postFileUrl} className={styles.post_image} onClick={() => navigate("/p/" + userPosts[index].slug)} />
                          </>
                        ) : (
                          <>
                            <video className={styles.post_image} muted onClick={() => navigate("/p/" + userPosts[index].slug)}>
                              <source src={userPosts[index].postFileUrl} type="video/mp4" />
                            </video>
                          </>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                    <div className={styles.reel_rectangle}>
                      {index + 1 < userPosts.length ? (
                        userPosts[index + 1].postType === "image" ? (
                          <img src={userPosts[index + 1].postFileUrl} className={styles.post_image} onClick={() => navigate("/p/" + userPosts[index + 1].slug)} />
                        ) : (
                          <>
                            <video className={styles.post_image} muted onClick={() => navigate("/p/" + userPosts[index + 1].slug)}>
                              <source src={userPosts[index + 1].postFileUrl} type="video/mp4" />
                            </video>
                          </>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                    <div className={styles.reel_rectangle}>
                      {index + 2 < userPosts.length ? (
                        userPosts[index + 2].postType === "image" ? (
                          <img src={userPosts[index + 2].postFileUrl} className={styles.post_image} onClick={() => navigate("/p/" + userPosts[index + 2].slug)} />
                        ) : (
                          <>
                            <video className={styles.post_image} muted onClick={() => navigate("/p/" + userPosts[index + 2].slug)}>
                              <source src={userPosts[index + 2].postFileUrl} type="video/mp4" />
                            </video>
                          </>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <>
              <div className={styles.reels_tray_container_no_post}>
                <BsCamera fontSize="25px" />
                <h1 className={styles.no_post}>No Posts yet</h1>
              </div>
            </>
          )}
        </div>
      </div>
      {isOpen && <UploadPhoto setIsOpen={setIsOpen} profileImageUrl={userProfile.profileImageUrl} />}
      <BottomBar />
    </>
  );
};
export default UserProfile;
