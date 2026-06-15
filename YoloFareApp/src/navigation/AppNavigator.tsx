import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors } from '../lib/colors'

import DealsScreen from '../screens/DealsScreen'
import DealDetailScreen from '../screens/DealDetailScreen'
import PricingScreen from '../screens/PricingScreen'
import LoginScreen from '../screens/LoginScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const screenOpts = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' as const, color: colors.text },
}

function DealsStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="Deals" component={DealsScreen} options={{ title: 'YoloFare · Deals' }} />
      <Stack.Screen name="DealDetail" component={DealDetailScreen} options={{ title: 'Deal Details' }} />
    </Stack.Navigator>
  )
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
}

export default function AppNavigator() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_e, session) => setSession(session))
  }, [])

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.bg, borderTopColor: 'rgba(255,255,255,0.08)', borderTopWidth: 0.5 },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textDim,
          headerShown: false,
        }}
      >
        <Tab.Screen name="DealsTab" component={DealsStack}
          options={{ title: 'Deals', tabBarIcon: ({ focused }) => <TabIcon emoji="✈️" focused={focused} /> }} />
        <Tab.Screen name="Pricing" component={PricingScreen}
          options={{ ...screenOpts, headerShown: true, title: 'Pricing', tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} /> }} />
        <Tab.Screen name="Login" component={session ? ProfileScreen : LoginScreen}
          options={{ ...screenOpts, headerShown: true, title: session ? 'Profile' : 'Sign In', tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}