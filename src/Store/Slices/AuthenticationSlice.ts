import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';


const initialState = {
    tokenExpiration: ""
}

const slice = createSlice({
    name: "Authentication",
    initialState,
    reducers: {
        setTokenExpiration(state,action: PayloadAction<string>) {
            state.tokenExpiration = action.payload;
        },
        clearTokenExpiration(state){
            state.tokenExpiration = "";
        }
    }
})

export default slice.reducer;
export const {setTokenExpiration,clearTokenExpiration} = slice.actions;