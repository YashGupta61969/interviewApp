import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCompleted: false,
    videoFiles: []
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
        }
    }
})

export default userSlice.reducer

export const { updateIsCompleted, addVideoFile } = userSlice.actions