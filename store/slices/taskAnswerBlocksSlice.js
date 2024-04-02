import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    task_answer_blocks: [],
    task_answer_blocks_count: 0
}

export const taskAnswerBlocksSlice = createSlice({
    name: 'taskAnswerBlocks',
    initialState,
    reducers: {
        setTaskAnswerBlocks: (state, action) => {
            state.task_answer_blocks = action.payload
        },
        setTaskAnswerBlocksCount: (state, action) => {
            state.task_answer_blocks_count = action.payload
        }
    }
});

export const { setTaskAnswerBlocks, setTaskAnswerBlocksCount } = taskAnswerBlocksSlice.actions
export default taskAnswerBlocksSlice.reducer