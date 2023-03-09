import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/userSlice";
import lessonBlocksSlice from "./slices/lessonBlocksSlice";
import testQuestionBlocksSlice from "./slices/testQuestionBlocksSlice";
export const store = configureStore({
    reducer: {
        authUser: authSlice,
        lessonBlocks: lessonBlocksSlice,
        testQuestionBlocks: testQuestionBlocksSlice
    }
})