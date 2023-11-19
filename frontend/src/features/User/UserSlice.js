import { createSlice } from "@reduxjs/toolkit"

const initialState = {}

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { setUser } = UserSlice.actions
export const getUser = (state) => state.user
export default UserSlice.reducer