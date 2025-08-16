import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import { useIDS } from '../hooks/useIDS';

export default function SettingsScreen() {
  const { settings, updateSetting, toggleCheck } = useIDS();

  const checks = useMemo(
    () => [
      { id: 'root', label: 'Root/Jailbreak detection' },
      { id: 'emulator', label: 'Emulator detection' },
      { id: 'devMode', label: 'Developer mode' },
      { id: 'screenLock', label: 'Screen lock advisory' },
      { id: 'internet', label: 'Internet connectivity' },
      { id: 'network', label: 'Network type risk' },
    ],
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Auto Scan</Text>
          <Switch
            value={settings.enableAutoScan}
            onValueChange={(v) => updateSetting('enableAutoScan', v)}
          />
        </View>
        <View style={[styles.rowBetween, { marginTop: 12 }]}> 
          <Text style={styles.label}>Frequency (minutes)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(settings.frequencyMinutes)}
            onChangeText={(t) => {
              const n = Number(t.replace(/[^0-9]/g, '')) || 0;
              updateSetting('frequencyMinutes', Math.max(5, Math.min(720, n)));
            }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Checks</Text>
        {checks.map((c) => (
          <View key={c.id} style={styles.rowBetween}> 
            <Text style={styles.label}>{c.label}</Text>
            <Switch
              value={settings.enabledChecks[c.id as keyof typeof settings.enabledChecks]}
              onValueChange={() => toggleCheck(c.id as keyof typeof settings.enabledChecks)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220', padding: 16 },
  title: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#0F172A', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1E293B', marginBottom: 12 },
  sectionTitle: { color: 'white', fontWeight: '600', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: 'white' },
  input: { backgroundColor: '#111827', color: 'white', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, width: 80, textAlign: 'right' },
});
