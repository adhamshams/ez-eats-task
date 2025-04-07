import { useSession } from '@/contexts/ctx';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useLanguage } from '../../contexts/languageContext';

export default function TabLayout() {
  const { session, isLoading } = useSession();
  const { t } = useLanguage();

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
          title: t('home'),
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="language"
        options={{
          title: t('language'),
          tabBarIcon: ({ color }) => <Ionicons name="language" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
