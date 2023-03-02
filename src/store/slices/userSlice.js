import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCompleted:false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        updateIsCompleted:(state, {payload})=>{
            state.isCompleted = payload
        }
    }
})

export default userSlice.reducer

export const {updateIsCompleted} = userSlice.actions