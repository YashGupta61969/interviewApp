import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCompleted: false,
    videoFiles: [],
    retries: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateIsCompleted: (state, { payload }) => {
            state.isCompleted = payload
        },
        addVideoFile: (state, { payload }) => {
            state.videoFiles.push(payload)
        },
        clearVideoFiles:(state)=>{
            state.videoFiles = []
        },
        clearRetries:(state)=>{
            state.retries = []
        },
        addRetries: (state, { payload }) => {
            state.retries.push(payload)
        },
    }
})

export default userSlice.reducer

export const { updateIsCompleted, addVideoFile, addRetries, clearRetries, clearVideoFiles } = userSlice.actions