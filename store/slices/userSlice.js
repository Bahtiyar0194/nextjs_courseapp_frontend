import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authUser: [],
}

export const authUserSlice = createSlice({
    name: 'authUser',
    initialState,
    reducers: {
        authenticate: (state, action) => {
            state.authUser = action.payload
        }
    }
})

export const {authenticate} = authUserSlice.actions
export default authUserSlice.reducer