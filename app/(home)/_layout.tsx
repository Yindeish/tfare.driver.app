import { Href, Redirect, Stack, Tabs, usePathname } from 'expo-router';
import { Dimensions, View, Image } from 'react-native';
import { useSession } from '../../contexts/userSignedInContext';
import { tabs } from '@/constants/tabs';
import Colors, { colors } from '@/constants/Colors';
import TabBartTitle from '@/components/home/tabTitle';
import { pages } from '@/constants/pages';
import { homeImgs } from '@/constants/images/home';
import { useEffect } from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import { RideConstants } from '@/constants/ride';
import { useAppSelector } from '@/state/hooks/useReduxToolkit';
import { RootState } from '@/state/store';
import { flexYCenter } from '@/utils/styles';


export default function AppLayout() {
  const { userSession, isLoading, signOut } = useSession();
  const {query}= useAppSelector((state: RootState) => state.ride);

  // const [[_, query], setQuery] = useStorageState(RideConstants.localDB.query);
  const path = usePathname();
  // signOut()
  // console.log({ userSession, layout: 'home' })

  const { width, height } = Dimensions.get('window');

  // if (isLoading) {
  //   return <View style={{ width, height, backgroundColor: '#D8D8D8' }} />;
  // }

  // if (!userSession) {
  //   return <Redirect href={`/(auth)/signin` as Href} />;
  // }

  // else 
  return <Tabs screenOptions={{ tabBarActiveTintColor: Colors.light.background, headerShown: false }}>
    <Tabs.Screen
      name={tabs.home}
      options={{
        tabBarStyle: {
          backgroundColor: colors.white,
        },
        tabBarLabel: ({ color, focused }) => <TabBartTitle title='Home' color={focused ? Colors.light.blueBackground : color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 18, height: 19.72 }} source={focused ? homeImgs.activeHomeImg : homeImgs.homeImg} />,
        tabBarActiveBackgroundColor: colors.white
      }}
    />
    <Tabs.Screen
      name={tabs.trip}
      options={{
        tabBarLabel: ({ color, focused }) => <TabBartTitle title='Trip' color={focused ? Colors.light.blueBackground : color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 22, height: 19 }} source={focused ? homeImgs.activeTripImg : homeImgs.tripImg} />,
      }}
    />
    <Tabs.Screen
      name={tabs.offer}
      options={{
        tabBarLabel: ({ color, focused }) => <TabBartTitle title='Offers' color={focused ? Colors.light.blueBackground : color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 20.12, height: 19.43 }} source={focused ? homeImgs.activeOffersImg : homeImgs.offersImg} />,
      }}
    />
    <Tabs.Screen
      name={tabs.account}
      options={{
        tabBarLabel: ({ color, focused }) => <TabBartTitle title='Account' color={focused ? Colors.light.blueBackground : color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 15, height: 18 }} source={focused ? homeImgs.activeAccountImg : homeImgs.accountImg} />,
      }}
    />
  </Tabs>
}



