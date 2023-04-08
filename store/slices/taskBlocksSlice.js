import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    task_blocks: [],
    task_blocks_count: 0
}

export const taskBlocksSlice = createSlice({
    name: 'taskBlocks',
    initialState,
    reducers: {
        setTaskBlocks: (state, action) => {
            state.task_blocks = action.payload
        },
        setTaskBlocksCount: (state, action) => {
            state.task_blocks_count = action.payload
        }
    }
});

export const { setTaskBlocks, setTaskBlocksCount } = taskBlocksSlice.actions
export default taskBlocksSlice.reducer