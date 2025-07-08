import { Tabs } from 'expo-router'
import GlassTabBar from '.../../components/GlassTabBar' 

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Forest' }} />
      <Tabs.Screen name="ar" options={{ title: 'Spirit Vision' }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}