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
    const [[signedinTimeLoading, signedinTimeSession], setSignedinTimeSession] = useStorageState('signedinTime');
    const parsedUser = userString ? JSON.parse(userString as string) : null;
    const parsedSigninTimeSession = signedinTimeSession ? JSON.parse(signedinTimeSession as string) : null;


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
        // return <View style={{ width, height, backgroundColor: 'red' }} />;
    }

    // Accesssing the app for the first time
    if (!tokenSession) {
        return <Redirect href={`/introScreen` as Href} />;
        // return <View style={{ width: '100%', height: '100%', backgroundColor: 'green' }}>
        //     <Text>Green</Text>
        // </View>
    }
    // Accesssing the app for the first time

    // Accessed the ppa beofre, just revisiting
    else {
        return <Redirect href={`/(auth)/signin` as Href} />;
        // return <View style={{ width: '100%', height: '100%', backgroundColor: 'yellow' }}>
        //     <Text>Yellow</Text>
        // </View>
    }
    // Accessed the ppa beofre, just revisiting
}
