import { Href, Redirect, Stack, Tabs } from 'expo-router';
import { Dimensions, View, Image } from 'react-native';
import { useSession } from '../../contexts/userSignedInContext';
import { tabs } from '@/constants/tabs';
import Colors, { colors } from '@/constants/Colors';
import TabBartTitle from '@/components/home/tabTitle';
import { pages } from '@/constants/pages';
import { homeImgs } from '@/constants/images/home';
import { Text } from 'react-native-paper';

function AuthLayout() {
    const { userSession, isLoading, signOut } = useSession();
    // signOut()
    console.log({ userSession, layout: 'auth' })

    const { width, height } = Dimensions.get('window');

    if (isLoading) {
        return <View style={{ width, height, backgroundColor: '#D8D8D8' }} />;
    }

    if (userSession) return <Redirect href={"/(home)/" as Href} />;

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name={'index'} />
            <Stack.Screen name={'signin'} />
            <Stack.Screen name={'signup'} />
            <Stack.Screen name={'verifyEmail'} />
            <Stack.Screen name={'carInfoUpload'} />
        </Stack>
    )

}

export default AuthLayout;