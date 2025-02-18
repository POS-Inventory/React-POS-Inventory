import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";

// Define a User interface based on the expected structure of the user data
interface User {
    id: string;
    username: string;
    role: string;
    accessToken: string;
    // Add other fields as needed
}

// Define the initial state using an interface
interface AuthState {
    user: User | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: AuthState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// Define a LoginUser payload type
interface LoginUserPayload {
    username: string;
    password: string;
}

// LoginUser async thunk
export const LoginUser = createAsyncThunk(
    "user/LoginUser",
    async (user: LoginUserPayload, thunkAPI) => {
        try {
            const response = await axios.post("http://localhost:5000/login", {
                username: user.username,
                password: user.password,
            });
            // Store token in localStorage
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data; // Ensure this returns a user object
        } catch (error: any) {
            if (error.response) {
                const message = error.response.data.msg;
                return thunkAPI.rejectWithValue(message);
            }
        }
    }
);

// getMe async thunk
export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

// LogOut async thunk
export const LogOut = createAsyncThunk("user/LogOut", async () => {
    const token = localStorage.getItem("token");
    await axios.delete("http://localhost:5000/logout", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // Remove token from localStorage
    localStorage.removeItem("token");
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(
            LoginUser.fulfilled,
            (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.isError = false; // Explicitly reset error state
                state.message = ""; // Clear any error messages
            }
        );
        builder.addCase(LoginUser.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string;
        });
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string;
        });

        builder.addCase(LogOut.fulfilled, (state) => {
            state.user = null;
            state.isSuccess = false;
            state.isLoading = false;
            state.isError = false;
            state.message = "";
        });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
