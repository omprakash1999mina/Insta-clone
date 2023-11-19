import { storage } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { PostAuthRequest } from "../Post/authRequest"
import { setLoading } from "../../features/Loading/LoadingSlice"



// Upload the image on firebase storage
export const uploadFiles = (file, fileType, successFxn, enqueueSnackbar, navigate, dispatch) => {
    // setLoading(true);
    dispatch(setLoading(true))
    if (!file) return;
    const storageRef = ref(storage, `images/posts/${new Date().getTime()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => { },
        (error) => {
            // enqueueSnackbar("Some error occurred while uploading image. Please try again", {
            //   variant: "error",
            // });
            // setLoading(false);
            dispatch(setLoading(false))
            alert("Some error occurred while uploading image. Please try again")
            // return null
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log("Hi       " + url);
                postFunctions(url, fileType, successFxn, enqueueSnackbar, navigate, dispatch)
            });
        }
    );
};

export const postFunctions = (url, fileType, successFxn, enqueueSnackbar, navigate, dispatch) => {

    if (url != null) {
        console.log("first")
        const data = {
            "postFileUrl": url,
            "postLikesCount": 0,
            "postLikeUserIds": [],
            "postType": fileType

        }

        PostAuthRequest("api/post/create", data, successFxn, enqueueSnackbar, navigate)
        dispatch(setLoading(false))

    } else {
        console.log("No first")
    }

}