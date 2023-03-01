import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/userSlice";
import lessonBlocksSlice from "./slices/lessonBlocksSlice";
export const store = configureStore({
    reducer: {
        authUser: authSlice,
        lessonBlocks: lessonBlocksSlice
    }
})