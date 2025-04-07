import { configureStore } from '@reduxjs/toolkit';
import ride from './slices/ride';
import trip from './slices/trip';
import account from './slices/account';
import user from './slices/user'


export const store = configureStore({
    reducer: {
        ride,
        trip,
        account,
        user,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch