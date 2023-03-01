import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lesson_blocks: []
}

export const lessonBlocksSlice = createSlice({
    name: 'lessonBlocks',
    initialState,
    reducers: {
        setLessonBlocks: (state, action) => {
            state.lesson_blocks = action.payload
        }
    }
});

export const { setLessonBlocks } = lessonBlocksSlice.actions
export default lessonBlocksSlice.reducer