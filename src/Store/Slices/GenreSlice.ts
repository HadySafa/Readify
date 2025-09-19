import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Genre } from "../../Models/Genre";

interface GenresState {
    genres: Genre[];
    loading: boolean;
    error: string | null;
}

const initialState: GenresState = {
    genres: [],
    loading: false,
    error: null,
};


export const fetchGenres = createAsyncThunk<Genre[], void, { rejectValue: string }>("genres/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("http://localhost:5067/api/genres");
        return res.data.genres;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) return rejectWithValue(error.response.data?.message);
            if (error.request) return rejectWithValue("Unable to reach the server. Please try again.");
        }
        return rejectWithValue("Unexpected error occurred.");
    }
});


const genresSlice = createSlice({
    name: "genres",
    initialState,
    reducers: {
        clearGenreState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.loading = false;
                state.genres = action.payload;
                state.error = null;
            })
            .addCase(fetchGenres.pending, (state) => {
                state.loading = true;
                state.genres = [];
                state.error = null;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.loading = false;
                state.genres = []
                state.error = action.payload || "Unknown error";
            })

    }

},
);

export default genresSlice.reducer;
export const { clearGenreState } = genresSlice.actions;

