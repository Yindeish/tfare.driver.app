import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Href, Redirect } from 'expo-router';
import { useSession } from '@/contexts/userTokenContext';
import { pages } from '@/constants/pages';

export default function Index() {
    const { tokenSession, isLoading, } = useSession();

    const { width, height } = Dimensions.get('window');

    if (isLoading) {
        return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />;
    }

    if (!tokenSession) {
        return <Redirect href={`/${pages.baseScreens.introScreen}` as Href} />;
    }

    else {
        return <Redirect href={`/(auth)/${pages.authScreens.signin}` as Href} />;
    }
}
