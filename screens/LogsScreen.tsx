import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useIDS } from '../hooks/useIDS';

export default function LogsScreen() {
  const { logs, clearLogs } = useIDS();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Security Logs</Text>
        {logs.length > 0 && (
          <Pressable onPress={clearLogs} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={logs.length === 0 ? styles.emptyList : undefined}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderColor: riskColor(item.level) }]}> 
            <Text style={styles.itemTitle}>
              {item.check.toUpperCase()} • {new Date(item.time).toLocaleString()}
            </Text>
            <Text style={styles.itemMsg}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No alerts yet.</Text>}
      />
    </View>
  );
}

function riskColor(level: 'low' | 'medium' | 'high') {
  switch (level) {
    case 'high':
      return '#DC2626';
    case 'medium':
      return '#F59E0B';
    default:
      return '#1E293B';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: 'white', fontSize: 22, fontWeight: '700' },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#1E293B', borderRadius: 8 },
  clearText: { color: '#94A3B8', fontWeight: '600' },
  item: { backgroundColor: '#0F172A', padding: 12, borderRadius: 10, borderWidth: 1, marginTop: 12 },
  itemTitle: { color: 'white', fontWeight: '600' },
  itemMsg: { color: '#94A3B8', marginTop: 6, fontSize: 12 },
  emptyList: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8' },
});
