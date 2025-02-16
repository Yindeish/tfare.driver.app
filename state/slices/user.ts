import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserAccount } from "../types/account";


export interface IWallet {
    balance: number,
    bank_name: string,
    account_number: number,
    user_id: string,
}

export interface IUserState {
    user: IUserAccount | null,
    token: string,
    wallet: IWallet | null,
}

const initialState: IUserState = {
    token: '',
    user: null,
    wallet: null
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