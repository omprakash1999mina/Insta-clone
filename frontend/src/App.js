import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useEffect} from "react"
import LoginPage from "./Components/LoginPage/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./Components/LoginPage/Register"
import SignupPage1 from "./Components/LoginPage/RegisterCopy"
import SignupPage2 from "./Components/LoginPage/RegisterCopy1"
import { useVideoAutoplay } from "./Components/Post/videoAutoPlay"
import UserProfile from "../src/Components/Profile/userProfile"
import PostsPage from "./Components/Post/PostsPage";
import {useSelector} from "react-redux"
import {getLoading} from "./features/Loading/LoadingSlice"
import MessengerPage from "./pages/MessengerPage";

function App() {
  useVideoAutoplay()
  const loadingState = useSelector(getLoading)

  useEffect(() => {
    if (loadingState && loadingState.loading==true) {
      document.body.style.overflow = 'hidden'
    }else{
      document.body.style.overflow = 'auto'
    }
  }, [loadingState.loading])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route key="1" exact path="/login" element={<LoginPage />} />
          <Route key="2" exact path="/" element={<HomePage />} />
          <Route key="3" exact path="/signup" element={<SignupPage />} />
          <Route key="3" exact path="/signup1" element={<SignupPage1 />} />
          <Route key="3" exact path="/signup2" element={<SignupPage2 />} />
          <Route key="4" exact path="/:userName" element={<UserProfile />} />
          <Route key="5" exact path="/p/:postSlug" element={<PostsPage />} />
          <Route key="6" exact path="/message" element={<MessengerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
