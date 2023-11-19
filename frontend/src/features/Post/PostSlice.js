import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    posts: [],
    nextToken: 0
}

const PostSlice = createSlice({
    name: "postSlice",
    initialState,
    reducers: {
        setPost: (state, action) => {
            state.posts = action.payload
        },
        setNextToken: (state, action) => {
            state.nextToken = action.payload
        }
    }
})

export const { setPost, setNextToken } = PostSlice.actions
export const getPost = (state) => state.postSlice
export default PostSlice.reducer