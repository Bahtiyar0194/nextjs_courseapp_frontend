import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: [],
    roles: []
}

export const authUserSlice = createSlice({
    name: 'authUser',
    initialState,
    reducers: {
        authenticate: (state, action) => {
            state.user = action.payload
        },
        setRoles: (state, action) => {
            state.roles = action.payload
        }
    }
})

export const {authenticate, setRoles} = authUserSlice.actions
export default authUserSlice.reducer