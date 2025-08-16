import * as Network from 'expo-network';
import * as Device from 'expo-device';
import { LOGS_KEY, safeGetItem, safeSetItem } from '../lib/idsStorage';
import { v4 as uuid } from 'uuid';

// Lightweight background scan that avoids React hooks
export async function runBackgroundScan() {
  // Only simple checks that are safe in background
  const results: Array<{ id: string; passed: boolean; severity: 'low' | 'medium' | 'high'; message: string }> = [];

  const emulator = !Device.isDevice;
  results.push({
    id: 'emulator',
    passed: !emulator,
    severity: 'medium',
    message: emulator ? 'Running on emulator' : 'Physical device detected',
  });

  const state = await Network.getNetworkStateAsync();
  const risky = state.type === Network.NetworkStateType.UNKNOWN || state.type === Network.NetworkStateType.OTHER;
  results.push({
    id: 'network',
    passed: !risky,
    severity: risky ? 'medium' : 'low',
    message: `Network type: ${state.type}`,
  });

  const failures = results.filter((r) => !r.passed);
  if (failures.length) {
    const raw = (await safeGetItem(LOGS_KEY)) || '[]';
    let existing: any[] = [];
    try {
      existing = JSON.parse(raw);
    } catch {}
    const toAdd = failures.map((f) => ({ id: uuid(), time: Date.now(), level: f.severity, check: f.id, message: f.message }));
    const next = [...toAdd, ...existing].slice(0, 200);
    await safeSetItem(LOGS_KEY, JSON.stringify(next));
  }
}
