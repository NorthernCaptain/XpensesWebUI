import { createSlice } from '@reduxjs/toolkit'
import {getUserToken} from "../../api/auth";
import {useSelector} from "react-redux";

const authStorageKey = "xpense-auth-store";
export const authSlice = createSlice({
    name: 'auth',
    initialState: Object.assign({
        token: null,
        token_type: null,
        expires_time_millis: 0,
        error: null
    }, JSON.parse(localStorage.getItem(authStorageKey)) || {}),
        reducers: {
        login: (state, action) => {
            state.access_token = action.payload.access_token;
            state.token_type = action.payload.token_type;
            state.expires_time_millis = action.payload.expires_time_millis;
            state.error = action.payload.error;
            localStorage.setItem(authStorageKey, JSON.stringify(action.payload));
        }
    }
})

// Action creators are generated for each case reducer function
export const { login } = authSlice.actions

export const loginAsync = loginData => async dispatch => {
    let data = await getUserToken(loginData);
    dispatch(login(data))
}

export function useAuth() {
    const auth = useSelector(state => state.auth);
    const valid = auth.access_token && auth.expires_time_millis
        && auth.expires_time_millis > Date.now() + 60*1000; // our token doesn't expire in 1 min
    return { valid, ...auth }
}

export default authSlice.reducer