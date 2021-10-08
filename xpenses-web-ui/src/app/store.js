/**
 * Copyright 2021, Northern Captain
 */
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

export default configureStore({
    reducer: {
        auth: authReducer
    }
})
