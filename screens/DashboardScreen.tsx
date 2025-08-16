import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useIDS } from '../hooks/useIDS';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react-native';
import type { CheckResult } from '../types/ids';

export default function DashboardScreen() {
  const { runScan, settings } = useIDS();
  const [last, setLast] = useState<{ score: number; highest: string; results: CheckResult[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const onScan = useCallback(async () => {
    setLoading(true);
    try {
      const r = await runScan();
      setLast({ score: r.riskScore, highest: r.highestSeverity, results: r.results });
    } finally {
      setLoading(false);
    }
  }, [runScan]);

  const statusColor = useMemo(() => {
    if (!last) return '#94A3B8';
    switch (last.highest) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  }, [last]);

  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <Text style={styles.title}>Android IDS</Text>
        <Text style={styles.subtitle}>Monitor and detect malicious activities</Text>
      </View>

      <View style={[styles.scoreCard, { borderColor: statusColor }]}> 
        <Text style={styles.scoreLabel}>Risk Score</Text>
        <Text style={[styles.scoreValue, { color: statusColor }]}>{last?.score ?? 0}</Text>
        <Text style={styles.scoreCaption}>Highest severity: {last?.highest ?? 'unknown'}</Text>
        <Pressable style={[styles.scanBtn, { backgroundColor: statusColor }]} onPress={onScan} disabled={loading}>
          {loading ? (
            <RefreshCw color="#0B1220" size={18} />
          ) : (
            <Text style={styles.scanText}>Scan Now</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {last?.results?.map((res) => (
          <CheckRow key={res.id} res={res} />
        )) || (
          <Text style={styles.placeholder}>Tap Scan to run security checks.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function CheckRow({ res }: { res: CheckResult }) {
  const icon = res.passed ? (
    <CheckCircle2 color="#10B981" size={20} />
  ) : res.severity === 'high' ? (
    <AlertTriangle color="#DC2626" size={20} />
  ) : (
    <XCircle color="#F59E0B" size={20} />
  );

  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{res.id}</Text>
        <Text style={styles.rowMsg}>{res.message}</Text>
      </View>
      <Text style={styles.rowBadge}>{res.passed ? 'OK' : res.severity.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220', padding: 16 },
  header: { paddingVertical: 8 },
  title: { color: 'white', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  scoreCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  scoreLabel: { color: '#94A3B8', fontSize: 12 },
  scoreValue: { fontSize: 40, fontWeight: '800', marginTop: 4 },
  scoreCaption: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  scanBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: { color: '#0B1220', fontWeight: '700' },
  list: { paddingVertical: 12 },
  placeholder: { color: '#94A3B8', textAlign: 'center', marginTop: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 10,
    borderColor: '#1E293B',
    borderWidth: 1,
    marginBottom: 10,
  },
  rowIcon: { width: 28, alignItems: 'center' },
  rowBody: { flex: 1, marginLeft: 8 },
  rowTitle: { color: 'white', fontWeight: '600', textTransform: 'capitalize' },
  rowMsg: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  rowBadge: { color: '#94A3B8', fontSize: 12 },
});
