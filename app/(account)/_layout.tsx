import { Redirect, Stack, Tabs } from 'expo-router';
import { Dimensions, View, Image } from 'react-native';
import { useSession } from '../../contexts/userSignedInContext';
import { useEffect } from 'react';
import { pages } from '../../constants/pages';
import { FontAwesome } from '@expo/vector-icons';
import { tabs } from '../../constants/tabs';
import Colors, { colors } from '../../constants/Colors';


export default function AppLayout() {
  const { userSession, isLoading } = useSession();

  const { width, height } = Dimensions.get('window');

  if (isLoading) {
    return <View style={{ width, height, backgroundColor: '#D8D8D8' }} />;
  }

  if (!userSession) {
    return <Redirect href="/(auth)/signin" />;
  }

  else return <Stack
    screenOptions={{
      animation: 'slide_from_left',
      headerShown: false
    }}>
    <Stack.Screen name={'profileInfo'} />
    <Stack.Screen name={'myVehicle'} />
    <Stack.Screen name={'personalDocument'} />
    <Stack.Screen name={'accountSecurity'} />
    <Stack.Screen name={'bankDetails'} />
    <Stack.Screen name={'termsAndConditions'} />
    <Stack.Screen name={'notifications'} />
    <Stack.Screen name={'contactSupport'} />
  </Stack>
}



