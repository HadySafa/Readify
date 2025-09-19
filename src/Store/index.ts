import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from './Slices/AuthenticationSlice'
import AuthorSlice from './Slices/AuthorSlice'
import GenreSlice from './Slices/GenreSlice'
import BookSlice from './Slices/BookSlice'
import StatsSlice from './Slices/StatsSlice'

const store = configureStore({
    reducer:{
        auth:AuthenticationSlice,
        author:AuthorSlice,
        genre: GenreSlice,
        book: BookSlice,
        stats: StatsSlice
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch
