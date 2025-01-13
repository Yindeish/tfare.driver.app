import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserAccount } from "../types/account";


export interface IUserState {
    user: IUserAccount | null,
    token: string
}

const initialState: IUserState = {
    token: '',
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserState: (state, action: PayloadAction<{key: keyof IUserState, value: any}>) => {
            const {key, value} = action.payload;

            state[key] = value;
        }
    }
})

export default userSlice.reducer;

export const {setUserState} = userSlice.actions;