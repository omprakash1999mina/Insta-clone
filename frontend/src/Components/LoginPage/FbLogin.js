import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { auth, provider } from "../../firebase"
import { setLoading, getLoading } from "../../features/Loading/LoadingSlice"
import axios from "axios"

export const signup = (name, username, email, password, dispatch, enqueueSnackbar, navigate) => {
  dispatch(setLoading(true))
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const data = {
    name: name,
    userName: username,
    email: email,
    password: password,
  };
  console.log(data);
  axios.post(process.env.REACT_APP_BACKEND_URL + "api/user/register", data, config).then((response) => {
    console.log(response);
    enqueueSnackbar("Sign Up successfull", {
      variant: 'success',
    });
    navigate("/login")
    dispatch(setLoading(false))
  })
    .catch((error) => {
      console.log(error);
      enqueueSnackbar("Some error occurred while submitting. Please try again", {
        variant: 'error',
      });
      dispatch(setLoading(false))
    });
};


export const emailExist = (email) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const data = {
    email: email
  };
  console.log(data);
  axios.post(process.env.REACT_APP_BACKEND_URL + "api/emailexist", data, config).then((response) => {
    console.log(response);
    console.log("userSignupSuccessfull");
  })
    .catch((error) => {
      console.log("hi");
      console.log(error);
    });
};


// export const FbLogin = () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       // The signed-in user info.
//       const user = result.user;

//       console.log(user)
//       console.log(result)
//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       // const credential = FacebookAuthProvider.credentialFromResult(result);
//       // const accessToken = credential.accessToken;
//       return {
//         name: user.displayName,
//         email: user.email
//       }


//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = FacebookAuthProvider.credentialFromError(error);
//       console.log(errorMessage + " " + errorCode + " " + email + " " + credential);

//       // ...
//     });
// }


export const googleSignIn = ()=>{
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios.get("/api/asdf").then((response) => {
    console.log(response)
  })
    .catch((error) => {
      console.log(error);
    });
}