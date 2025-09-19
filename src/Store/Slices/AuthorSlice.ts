import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import type { Author } from '../../Models/Author';

interface InitialStateType {
  authors: Author[],
  loading: boolean,
  error: string | null | undefined
}

const initialState: InitialStateType = {
  authors: [],
  loading: false,
  error: null
}

export const fetchAuthors = createAsyncThunk<Author[], void, { rejectValue: string }>("authors/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("http://localhost:5067/api/authors");
    return res.data.authors;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) return rejectWithValue(error.response.data?.message);
      if (error.request) return rejectWithValue("Unable to reach the server. Please try again.");
    }
    return rejectWithValue("Unexpected error occurred.");
  }
});


const slice = createSlice({
  name: "Author",
  initialState,
  reducers: {
    clearAuthorState: (state) => {
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
        state.error = null;
      })
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.authors = [];
        state.error = null;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.authors = []
        state.error = action.payload || "Unknown error";
      });
  }
})

export default slice.reducer;
export const { clearAuthorState } = slice.actions;