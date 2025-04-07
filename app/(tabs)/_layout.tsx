import { useSession } from '@/contexts/ctx';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  } 

  if (!session) {
    return <Redirect href="/(auth)/phone-number" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false}}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="language"
        options={{
          title: 'Language',
          tabBarIcon: ({ color }) => <Ionicons name="language" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
