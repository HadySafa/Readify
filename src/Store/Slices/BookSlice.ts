import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Book } from "../../Models/Book";

interface BooksState {
    books: Book[];
    loading: boolean;
    error: string | null;
}

const initialState: BooksState = {
    books: [],
    loading: false,
    error: null,
};


export const fetchBooks = createAsyncThunk<Book[], void, { rejectValue: string }>("books/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("http://localhost:5067/api/books");
        return res.data.books;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) return rejectWithValue(error.response.data?.message);
            if (error.request) return rejectWithValue("Unable to reach the server. Please try again.");
        }
        return rejectWithValue("Unexpected error occurred.");
    }
});


const booksSlice = createSlice({
    name: "books",
    initialState,
    reducers: {
        clearBookState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
                state.error = null;
            })
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.books = [];
                state.error = null;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.books = []
                state.error = action.payload || "Unknown error";
            })

    }

},
);

export default booksSlice.reducer;
export const { clearBookState } = booksSlice.actions;

