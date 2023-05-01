import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    disk_data: []
}

export const diskSlice = createSlice({
    name: 'disk',
    initialState,
    reducers: {
        setDiskData: (state, action) => {
            state.disk_data = action.payload
        }
    }
})

export const {setDiskData} = diskSlice.actions
export default diskSlice.reducer