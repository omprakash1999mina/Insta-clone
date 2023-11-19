import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import insta_image from "../../images/9364675fb26a.svg";
import insta_logo from "../../images/logoinsta.png";
import fb from "../../images/fb.png";
import playstore from "../../images/play.png";
import appstore from "../../images/app.png";
import "./LoginPage.css";
import axios from "axios";
import { googleSignIn } from "./FbLogin";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, getLoading } from "../../features/Loading/LoadingSlice";
import { useSnackbar } from "notistack";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const loadingState = useSelector(getLoading);
  const { enqueueSnackbar } = useSnackbar();

  const signin = () => {
    dispatch(setLoading(true));
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      email: email,
      password: password,
    };
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "api/user/login", data, config)
      .then((response) => {
        dispatch(setLoading(false));
        console.log(response);
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        enqueueSnackbar("Logged in successfully", {
          variant: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        console.log("hi");
        console.log(error);
        enqueueSnackbar("Invalid  Credentials", {
          variant: "error",
        });
        dispatch(setLoading(false));
      });
  };
  return (
    <>
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
                  <div>
                    <input className="LoginPage_text" type="text" placeholder="Phone number, username or email" onChange={(e) => setEmail(e.target.value)} />
                    <input className="LoginPage_text" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button className="LoginPage_button" onClick={() => signin()}>
                      Sign In
                    </button>
                  </div>

                  <div className="Login_ordiv">
                    <div className="Login_divider"></div>
                    <div className="Login_or">OR</div>
                    <div className="Login_divider"></div>
                  </div>
                  <a href="http://localhost:5000/api/auth/google">
                    <div className="Login_fb" >
                      <img src={fb} width="15px" style={{ marginRight: "5px" }} alt="play" />
                      Log in with facebook
                    </div>
                  </a>
                  <div className="Login_forgot" onClick={()=>{googleSignIn()}}>Forgot password</div>
                </div>
              </div>
              <div className="LoginPage_signupoption">
                <div className="LoginPage_signup">
                  Don't have an account?{" "}
                  <span onClick={() => navigate("/signup")} style={{ fontWeight: "bold", color: "#0395f6" }}>
                    {" "}
                    SignUp
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
    </>
  );
}

export default LoginPage;
