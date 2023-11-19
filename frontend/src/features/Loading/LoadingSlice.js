import { createSlice } from "@reduxjs/toolkit"

const initialState = {}

const LoadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setLoading } = LoadingSlice.actions
export const getLoading = (state) => state.loading
export default LoadingSlice.reducer