import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dashboard_data: []
}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.dashboard_data = action.payload
        }
    }
})

export const {setDashboardData} = dashboardSlice.actions
export default dashboardSlice.reducer