import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import DashboardScreen from './screens/DashboardScreen';
import LogsScreen from './screens/LogsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { ShieldAlert, List, Settings as SettingsIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { IDSProvider } from './context/IDSContext';

const Tab = createBottomTabNavigator();

const BACKGROUND_TASK_NAME = 'IDS_BACKGROUND_SCAN';

if (Platform.OS === 'android') {
  TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    try {
      const { runBackgroundScan } = await import('./hooks/useIDSBackground');
      await runBackgroundScan();
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563EB' }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <ShieldAlert color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Logs"
        component={LogsScreen}
        options={{ tabBarIcon: ({ color, size }) => <List color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const register = async () => {
      try {
        if (Platform.OS === 'android') {
          await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
            minimumInterval: 15 * 60,
            stopOnTerminate: false,
            startOnBoot: true,
          });
        }
      } catch (_) {}
    };
    register();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      <NavigationContainer>
        <IDSProvider>
          <Tabs />
        </IDSProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, userSelect: 'none', backgroundColor: '#0B1220' },
});
