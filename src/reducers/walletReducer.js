
import { createSlice } from '@reduxjs/toolkit'

export const currentWalletAddressReducer = createSlice({
  name: 'walletAddress',
  initialState: {
    walletAddress: null
  },
  reducers: {
    
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload
    },
  },
})

export const { setWalletAddress } = currentWalletAddressReducer.actions

export default currentWalletAddressReducer.reducer