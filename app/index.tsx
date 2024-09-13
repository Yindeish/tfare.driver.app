import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { Href, Redirect } from 'expo-router';
import { useSession } from '@/contexts/userTokenContext';
import { useSession as userSession } from '@/contexts/userSignedInContext';
import { pages } from '@/constants/pages';

export default function Index() {
    const { tokenSession, isLoading, } = useSession();
    const { userSession: userSess, signOut } = userSession()
    // signOut()
    // console.log(userSess, tokenSession)

    const { width, height } = Dimensions.get('window');

    if (isLoading) {
        return <View style={{ width, height, backgroundColor: '#D7D7D7' }} />;
        // return <View style={{ width, height, backgroundColor: 'red' }} />;
    }

    if (!tokenSession) {
        return <Redirect href={`/introScreen` as Href} />;
        // return <View style={{ width: '100%', height: '100%', backgroundColor: 'green' }}>
        //     <Text>Green</Text>
        // </View>
    }

    else {
        // return <Redirect href={`/(auth)/signin` as Href} />;
        return <Redirect href={`/(auth)/carInfoUpload` as Href} />; //testing
        // return <View style={{ width: '100%', height: '100%', backgroundColor: 'yellow' }}>
        //     <Text>Yellow</Text>
        // </View>
    }
}
