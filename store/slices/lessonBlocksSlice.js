import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lesson_blocks: [],
    lesson_blocks_count: 0
}

export const lessonBlocksSlice = createSlice({
    name: 'lessonBlocks',
    initialState,
    reducers: {
        setLessonBlocks: (state, action) => {
            state.lesson_blocks = action.payload
        },
        setLessonBlocksCount: (state, action) => {
            state.lesson_blocks_count = action.payload
        }
    }
});

export const { setLessonBlocks, setLessonBlocksCount } = lessonBlocksSlice.actions
export default lessonBlocksSlice.reducer