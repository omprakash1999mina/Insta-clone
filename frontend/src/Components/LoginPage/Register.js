import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import insta_image from "../../images/9364675fb26a.svg";
import insta_logo from "../../images/logoinsta.png";
import fb from "../../images/fb.png";
import playstore from "../../images/play.png";
import appstore from "../../images/app.png";
import "./LoginPage.css";
import { signup } from "./FbLogin";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, getLoading } from "../../features/Loading/LoadingSlice";
import { useSnackbar } from "notistack";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const loadingState = useSelector(getLoading);
  const { enqueueSnackbar } = useSnackbar();
  const [usernameExist, setUsernameExist] = useState(false);

  useEffect(() => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (username) {
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "api/user/usernameexist", { username: username }, config)
        .then((response) => {
          setUsernameExist(response.data.message);
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar("Some error occurred", {
            variant: "error",
          });
        });
    }
  }, [username]);

  return (
    <div>
      {loadingState.loading && <Loader />}
      <div className="LoginPage_main_container">
        <div className="LoginPage_container">
          <div className="LoginPage_main">
            <div className="LoginPage_image_container">
              <img src={insta_image} width="454px" alt="play" />
            </div>
            <div>
              <div className="LoginPage_rightcomponent">
                <img className="LoginPage_logo" src={insta_logo} alt="play" />
                <div className="LoginPage_signin">
                  <div className="input_div">
                    <input className="LoginPage_text" type="text" placeholder="Mobile number or email" onChange={(e) => setEmail(e.target.value)} />
                    <input className="LoginPage_text" type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
                    <input className="LoginPage_text" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    {usernameExist && <div className="checker">This username already exist</div>}
                    <input className="LoginPage_text" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button
                      className="LoginPage_button"
                      onClick={() =>
                        !usernameExist
                          ? signup(name, username, email, password, dispatch, enqueueSnackbar, navigate)
                          : enqueueSnackbar("This username already exist", {
                              variant: "error",
                            })
                      }
                    >
                      Sign Up
                    </button>
                  </div>
                  <div className="Login_ordiv">
                    <div className="Login_divider"></div>
                    <div className="Login_or">OR</div>
                    <div className="Login_divider"></div>
                  </div>
                  {/* <div className="Login_fb" onClick={() => { FbLogin() }}>
                    <img src={fb} width="15px" style={{ marginRight: "5px" }} alt="play" />
                    Log in with facebook
                  </div> */}
                  <div className="Login_forgot">Forgot password</div>
                </div>
              </div>
              <div className="LoginPage_signupoption">
                <div className="LoginPage_signin">
                  Have an account?{" "}
                  <span onClick={() => navigate("/login")} style={{ fontWeight: "bold", color: "#0395f6", cursor: "pointer" }}>
                    {" "}
                    SignIn
                  </span>
                </div>
              </div>
              <div className="LoginPage_downloadSection">
                <div>Get the app</div>
                <div>
                  <img className="LoginPage_dwing" src={appstore} alt="play" width="136px" />
                  <img className="LoginPage_dwing" src={playstore} alt="play" width="136px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
