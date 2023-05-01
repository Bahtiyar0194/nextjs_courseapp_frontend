import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/userSlice";
import lessonBlocksSlice from "./slices/lessonBlocksSlice";
import taskBlocksSlice from "./slices/taskBlocksSlice";
import testQuestionBlocksSlice from "./slices/testQuestionBlocksSlice";
import diskSlice from "./slices/diskSlice";
export const store = configureStore({
    reducer: {
        authUser: authSlice,
        lessonBlocks: lessonBlocksSlice,
        taskBlocks: taskBlocksSlice,
        testQuestionBlocks: testQuestionBlocksSlice,
        disk: diskSlice
    }
})