import { createSlice } from '@reduxjs/toolkit'
export const applicationReducer = createSlice({
    name: 'application',
    initialState: {
        app_name: "kyc"
    },
    reducers: {

        setApp: (state, action) => {
            state.app_name = action.payload
        },
    },
});
export const { setApp } = applicationReducer.actions
export default applicationReducer.reducer