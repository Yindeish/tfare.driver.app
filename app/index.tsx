import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Href, Redirect, router } from 'expo-router';
import { useSession } from '@/contexts/userTokenContext';
import { useSession as userSession } from '@/contexts/userSignedInContext';
import { pages } from '@/constants/pages';
import { useAppDispatch } from '@/state/hooks/useReduxToolkit';
import { useStorageState } from '@/hooks/useStorageState';
import { setUserState } from '@/state/slices/user';

export default function Index() {
    const dispatch = useAppDispatch();
    const { tokenSession, isLoading, } = useSession();
    const { userSession: userString, signOut } = userSession();
    const [[_, __], setToken] = useStorageState('token'); //testing
    const [[signedinTimeLoading, signedinTimeSession], setSignedinTimeSession] = useStorageState('signedinTime');
    const parsedUser = userString ? JSON.parse(userString as string) : null;
    const parsedSigninTimeSession = signedinTimeSession ? JSON.parse(signedinTimeSession as string) : null;

    // setToken(null); //testing
    console.log({tokenSession})


    // Updating the user state in RTK (Redux Toolkit Query)
    useEffect(() => {
        if (parsedUser && parsedSigninTimeSession) {
            // Check if the parsedSigninTimeSession is a valid date
            const signedinTime = new Date(parsedSigninTimeSession);
            const currentTime = new Date();

            // Ensure the date is valid before calculating
            if (isNaN(signedinTime.getTime())) {
                console.error('Invalid signedinTimeSession date.');
                return;
            }

            // Calculate the time difference in milliseconds
            const timeDifference = currentTime.getTime() - signedinTime.getTime();
            const maxSessionDuration = 24 * 60 * 60 * 1000; // 5 hours in milliseconds

            // If session has expired (more than 5 hours)
            const maxSessionReached = timeDifference > maxSessionDuration;

            if (!maxSessionReached) {
                // If the session is valid and within the time limit, set the user state
                dispatch(setUserState({ key: 'user', value: parsedUser as never}));
                dispatch(setUserState({key:'token', value: tokenSession}))
            } else {
                // If the session has expired, clear the user state
                dispatch(setUserState({ key: 'user', value: null as never}));
                dispatch(setUserState({key:'token', value: ''}))
            }
        } else {
            // Handle case where user or signedinTimeSession is null
            dispatch(setUserState({ key: 'user', value: null as never}));
            dispatch(setUserState({key:'token', value: ''}))
            !isLoading && router.replace('/(auth)/signin')
        }
    }, [userSession, signedinTimeSession, dispatch]);
    // signOut()
    // console.log(userSess, tokenSession)
    // Updating the user state in RTK (Redux Toolkit Query)

    const { width, height } = Dimensions.get('window');

    if (isLoading) {
        return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />;
    }

    if (parsedUser && tokenSession) {
        return <Redirect href={`/(home)` as Href} />;
    }

    // Accesssing the app for the first time
    if (!parsedUser && tokenSession) {
        return <Redirect href={`/(auth)/signin` as Href} />;
    }
    // Accesssing the app for the first time

    // Accessed the app beofre, just revisiting
    else {
        return <Redirect href={`/introScreen` as Href} />;
    }
    // Accessed the ppa beofre, just revisiting
}
