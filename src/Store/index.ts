import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from './Slices/AuthenticationSlice'

const store = configureStore({
    reducer:{
        auth:AuthenticationSlice,
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch
