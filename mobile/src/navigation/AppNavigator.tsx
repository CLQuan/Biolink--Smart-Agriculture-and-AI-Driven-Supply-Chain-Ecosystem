import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { colors, borderRadius } from '../theme';
import { RootStackParamList, SupplierTabParamList, DriverTabParamList } from '../types';

import LoginScreen from '../screens/auth/LoginScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import SupplierHomeScreen from '../screens/supplier/SupplierHomeScreen';
import GradingScreen from '../screens/supplier/GradingScreen';
import BatchListScreen from '../screens/supplier/BatchListScreen';
import SyncStatusScreen from '../screens/supplier/SyncStatusScreen';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import RouteScreen from '../screens/driver/RouteScreen';
import SensorsScreen from '../screens/driver/SensorsScreen';
import ScanDeliveryScreen from '../screens/driver/ScanDeliveryScreen';

const Stack = createStackNavigator<RootStackParamList>();
const SupplierTab = createBottomTabNavigator<SupplierTabParamList>();
const DriverTab = createBottomTabNavigator<DriverTabParamList>();

function TabBarIcon({
  name,
  color,
  size,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

function SupplierTabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  );
}

function SupplierTabs() {
  return (
    <SupplierTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMid,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <SupplierTab.Screen
        name="SupplierHome"
        component={SupplierHomeScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Home" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <SupplierTab.Screen
        name="Grading"
        component={GradingScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Grade" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'camera' : 'camera-outline'} size={size} color={color} />
          ),
        }}
      />
      <SupplierTab.Screen
        name="BatchList"
        component={BatchListScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Batches" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
          ),
        }}
      />
      <SupplierTab.Screen
        name="SyncStatus"
        component={SyncStatusScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Sync" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'cloud' : 'cloud-outline'} size={size} color={color} />
          ),
        }}
      />
    </SupplierTab.Navigator>
  );
}

function DriverTabs() {
  return (
    <DriverTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMid,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <DriverTab.Screen
        name="DriverHome"
        component={DriverHomeScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Home" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <DriverTab.Screen
        name="Route"
        component={RouteScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Route" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} />
          ),
        }}
      />
      <DriverTab.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Sensors" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'thermometer' : 'thermometer-lines'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <DriverTab.Screen
        name="ScanDelivery"
        component={ScanDeliveryScreen}
        options={{
          tabBarLabel: ({ focused }) => <SupplierTabLabel label="Scan" focused={focused} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'qr-code' : 'qr-code-outline'} size={size} color={color} />
          ),
        }}
      />
    </DriverTab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="SupplierTabs" component={SupplierTabs} />
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 6,
    height: 64,
  },
  tabLabel: {
    fontSize: 11,
    color: colors.textMid,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
