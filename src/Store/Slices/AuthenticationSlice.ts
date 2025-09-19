import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

interface AuthState {
  token: string;
  role: string | null;
  name: string | null;
}

interface DecodedToken {
  [key: string]: any; 
}

function getInitialRoleAndName(): { role: string | null; name: string | null }{

  const token = sessionStorage.getItem("token");
  if (!token) return { role: null, name: null };

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return {
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null,
      name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null
    };
  } catch {
    return { role: null, name: null };
  }
  
};

const initialState: AuthState = {
  token: sessionStorage.getItem("token") || "",
  ...getInitialRoleAndName(),
};

const slice = createSlice({
  name: "Authentication",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;

      try {
        const decoded: DecodedToken = jwtDecode(action.payload);
        state.role =
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
        state.name =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
      } catch (err) {
        console.error("Invalid token", err);
        state.role = null;
        state.name = null;
      }

      sessionStorage.setItem("token", action.payload);
    },

    clearToken(state) {
      state.token = "";
      state.role = null;
      state.name = null;
      sessionStorage.removeItem("token");
    },
  },
});

export default slice.reducer;
export const { setToken, clearToken } = slice.actions;
