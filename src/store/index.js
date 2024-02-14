import { combineReducers, configureStore } from '@reduxjs/toolkit'
import currentWalletAddressReducer from 'src/reducers/walletReducer';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import profileReducer from 'src/reducers/profileReducer';
import authReducer from 'src/reducers/authReducer';
import applicationReducer from 'src/reducers/applicationReducer';
import proposalReducer from 'src/components/proposalReducer/proposalReducer';
import launchPadReducer from "src/components/launchpad/launchpadReducer/launchpadReducer"
import projectDetailsReducer from "src/reducers/projectDetailsReducer"
const persistConfig = {
  key: 'root',
  storage,
  whitelist:["oidc","walletAddress","application","proposal"]
}
const rootReducer = combineReducers({
  oidc: authReducer,
  walletAddress: currentWalletAddressReducer,
  profile:profileReducer,
  application:applicationReducer,
  proposal:proposalReducer,
  projectDetails:projectDetailsReducer,
  launchpad:launchPadReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk]
})
export const persister = persistStore(store);
export default store