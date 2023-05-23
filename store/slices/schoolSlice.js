import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    school_data: []
}

export const authSchoolSlice = createSlice({
    name: 'school',
    initialState,
    reducers: {
        setSchoolData: (state, action) => {
            state.school_data = action.payload
        }
    }
})

export const {setSchoolData} = authSchoolSlice.actions
export default authSchoolSlice.reducer