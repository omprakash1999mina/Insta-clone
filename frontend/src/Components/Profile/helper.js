import { storage } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { PostAuthRequest } from "../Post/authRequest"



// Upload the image on firebase storage
export const uploadFiles = (file, oldFileUrl, enqueueSnackbar, navigate,successFxn) => {
    // setLoading(true);
    if (!file) return;
    const storageRef = ref(storage, `images/profile/${new Date().getTime()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => { },
        (error) => {
            alert("Firebase Error: Some error occurred while uploading image. Please try again")
            // return null
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log("Hi       " + url);
                postFunctions(url, oldFileUrl, enqueueSnackbar, navigate,successFxn)
            });
        }
    );
};

export const postFunctions = (url, oldFileUrl, enqueueSnackbar, navigate,successFxn) => {

    if (url != null) {
        console.log("first")
        const data = {
            "imageUrl": url,
            "oldImageUrl": oldFileUrl

        }
       
        PostAuthRequest("api/user/uploadProfilePic", data, successFxn, enqueueSnackbar, navigate)


    } else {
        console.log("No first")
    }

}