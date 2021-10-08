import { createSlice } from '@reduxjs/toolkit'
import {getUserToken} from "../../api/auth";
import {useSelector} from "react-redux";

const authStorageKey = "xpense-auth-store-4";
export const authSlice = createSlice({
    name: 'auth',
    initialState: Object.assign({
        token: null,
        token_type: null,
        expires_time_millis: 0,
        error: null,
        userId: null,
        groupCode: null,
        name: null
    }, JSON.parse(localStorage.getItem(authStorageKey)) || {}),
        reducers: {
        login: (state, action) => {
            state.token = action.payload.access_token;
            state.token_type = action.payload.token_type;
            state.expires_time_millis = action.payload.expires_time_millis;
            state.error = action.payload.error;
            localStorage.setItem(authStorageKey, JSON.stringify(state));
        },
        logout: (state, action) => {
            state.token = null;
            state.token_type = null;
            state.expires_time_millis = 0;
            state.error = null;
            localStorage.setItem(authStorageKey, JSON.stringify(state));
        },
        userInfo: (state, action) => {
            console.log("userInfo action", action)
            let data = action.payload
            if(data.id && data.group_code) {
                state.userId = data.id
                state.groupCode = data.group_code
                state.name = data.short_name
                state.abbr = data.short_name ? data.short_name[0].toUpperCase() : '?'
                localStorage.setItem(authStorageKey, JSON.stringify(state));
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { login, userInfo, logout } = authSlice.actions

export const loginAsync = loginData => async dispatch => {
    let data = await getUserToken(loginData);
    dispatch(login(data))
}

export function useAuth() {
    const auth = useSelector(state => state.auth);
    const valid = auth.token && auth.expires_time_millis
        && auth.expires_time_millis > Date.now() + 60*1000; // our token doesn't expire in 1 min
    return { valid, ...auth }
}

export default authSlice.reducer