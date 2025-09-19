import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import type { Author } from '../../Models/Author';
import type { Stats } from '../../Models/Stats';

interface InitialStateType {
    stats: Stats,
    error: string | null | undefined
}

const initialState: InitialStateType = {
    stats: {
        totalBooks: 0,
        availableBooks: 0,
        borrowedBooks: 0,
        genresCount: 0,
        totalAuthors: 0,
        totalUsers: 0
    },
    error: null
}

export const fetchStats = createAsyncThunk<Stats, void, { rejectValue: string }>("stats/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("http://localhost:5067/api/stats");
        return res.data.stats[0];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) return rejectWithValue(error.response.data?.message);
            if (error.request) return rejectWithValue("Unable to reach the server. Please try again.");
        }
        return rejectWithValue("Unexpected error occurred.");
    }
});


const slice = createSlice({
    name: "Stats",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload;
                state.error = null;
            })
            .addCase(fetchStats.pending, (state) => {
                state.stats = {
                    totalBooks: 0,
                    availableBooks: 0,
                    borrowedBooks: 0,
                    genresCount: 0,
                    totalAuthors: 0,
                    totalUsers: 0
                };
                state.error = null;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.stats = {
                    totalBooks: 0,
                    availableBooks: 0,
                    borrowedBooks: 0,
                    genresCount: 0,
                    totalAuthors: 0,
                    totalUsers: 0
                };
                state.error = action.payload || "Unknown error";
            });
    }
})

export default slice.reducer;
export const { } = slice.actions;