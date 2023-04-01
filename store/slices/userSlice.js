import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: []
}

export const authUserSlice = createSlice({
    name: 'authUser',
    initialState,
    reducers: {
        authenticate: (state, action) => {
            state.user = action.payload
        }
    }
})

export const {authenticate} = authUserSlice.actions
export default authUserSlice.reducer