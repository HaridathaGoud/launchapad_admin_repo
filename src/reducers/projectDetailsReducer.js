
import { createSlice } from '@reduxjs/toolkit'

export const projectDetailsReducer = createSlice({
  name: 'projectDetails',
  initialState: {
    details: null,
    project:null
  },
  reducers: {
    
    setProjectDetail: (state, action) => {
      state.details = action.payload
    },
    setProject: (state, action) => {
      state.project = action.payload
    },
  },
})

export const { setProjectDetail,setProject } = projectDetailsReducer.actions

export default projectDetailsReducer.reducer