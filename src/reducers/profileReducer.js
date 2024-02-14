
import { createSlice } from '@reduxjs/toolkit'

export const profileReducer = createSlice({
  
  name: 'profile',
  initialState: {
    user: null,
    loading:false
  },
  reducers: {
    
    setUserInfo: (state, action) => {
      state.user = action.payload
    },
   
  },
})

// Action creators are generated for each case reducer function
export const { setUserInfo } = profileReducer.actions

export default profileReducer.reducer