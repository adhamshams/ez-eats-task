import { useSession } from '@/contexts/ctx';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';


export default function TabLayout() {

  // const { session, isLoading } = useSession();

  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (!session) {
  //   return <Redirect href="/(auth)" />;
  // }

  return (
    <Tabs
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        //tabBarButton: HapticTab,
        //tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          //tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
