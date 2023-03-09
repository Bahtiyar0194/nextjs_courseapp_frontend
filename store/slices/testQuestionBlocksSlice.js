import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    test_question_blocks: [],
    test_question_blocks_count: 0
}

export const testQuestionBlocksSlice = createSlice({
    name: 'testQuestionBlocks',
    initialState,
    reducers: {
        setTestQuestionBlocks: (state, action) => {
            state.test_question_blocks = action.payload
        },
        setTestQuestionBlocksCount: (state, action) => {
            state.test_question_blocks_count = action.payload
        }
    }
});

export const { setTestQuestionBlocks, setTestQuestionBlocksCount } = testQuestionBlocksSlice.actions
export default testQuestionBlocksSlice.reducer