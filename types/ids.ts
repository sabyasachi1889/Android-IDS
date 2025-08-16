// Types and constants for the IDS system

export type RiskLevel = 'low' | 'medium' | 'high';

export type CheckId =
  | 'root'
  | 'emulator'
  | 'devMode'
  | 'screenLock'
  | 'internet'
  | 'network';

export type CheckResult = {
  id: CheckId;
  passed: boolean;
  severity: RiskLevel; // severity if this check fails
  message: string;
  meta?: Record<string, any> | null;
};

export type ScanResult = {
  timestamp: number;
  results: CheckResult[];
  riskScore: number; // 0-100
  highestSeverity: RiskLevel;
};

export type LogEntry = {
  id: string;
  time: number;
  level: RiskLevel;
  check: CheckId;
  message: string;
  meta?: Record<string, any> | null;
};

export type IDSSettings = {
  enableAutoScan: boolean;
  frequencyMinutes: number; // desired background scan cadence
  enabledChecks: Record<CheckId, boolean>;
};

export const defaultSettings: IDSSettings = {
  enableAutoScan: true,
  frequencyMinutes: 30,
  enabledChecks: {
    root: true,
    emulator: true,
    devMode: true,
    screenLock: true,
    internet: true,
    network: true,
  },
};
