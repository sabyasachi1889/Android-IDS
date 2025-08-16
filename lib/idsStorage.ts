import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SETTINGS_KEY = 'ids_settings_v1';
export const LOGS_KEY = 'ids_logs_v1';

export async function safeGetItem(key: string) {
  try {
    const secure = await SecureStore.getItemAsync(key);
    if (secure != null) return secure;
  } catch {}
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function safeSetItem(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {}
  try {
    await AsyncStorage.setItem(key, value);
  } catch {}
}
