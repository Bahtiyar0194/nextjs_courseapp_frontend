import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/userSlice";
export const store = configureStore({
    reducer: {
        authUser: authSlice
    }
})