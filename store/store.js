import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./slices/todo/todoSlice";
export const store = configureStore({
    reducer: {
        todo: todoSlice
    }
})