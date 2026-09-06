import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { UserProfile } from '../data/mobileData';
import { getApiBaseUrl } from '../api/client';

interface SettingsScreenProps {
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSwitchUserPrompt: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', desc: 'Default international language' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', desc: 'राष्ट्रीय भाषा (देवनागरी)' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', desc: 'રાજ્ય ભાષા (ગુજરાત)' },
];

export default function SettingsScreen({ currentUser, onUpdateUser, onSwitchUserPrompt }: SettingsScreenProps) {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [location, setLocation] = useState(currentUser.location);
  const [selectedLang, setSelectedLang] = useState('en');
  const [currency, setCurrency] = useState('INR');

  // Preferences
  const [darkMode, setDarkMode] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [haptics, setHaptics] = useState(true);

  // Server health state
  const [serverStatus, setServerStatus] = useState<'IDLE' | 'CHECKING' | 'ONLINE' | 'ERROR'>('IDLE');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleSaveProfile = () => {
    onUpdateUser({
      ...currentUser,
      name,
      phone,
      location,
    });
    Alert.alert('Profile Updated', 'Your profile details have been saved successfully.');
  };

  const handleTestServer = async () => {
    setServerStatus('CHECKING');
    const start = Date.now();
    const apiUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${apiUrl}/assistant/health/`, {
        method: 'GET',
      });
      const end = Date.now();
      setLatencyMs(end - start);
      if (res.ok) {
        setServerStatus('ONLINE');
        Alert.alert('Server Connected', `Django API responded in ${end - start}ms.`);
      } else {
        setServerStatus('ONLINE');
        Alert.alert('Server Reachable', `Connected with status ${res.status} (${end - start}ms).`);
      }
    } catch (e) {
      setServerStatus('ERROR');
      Alert.alert('Connection Notice', `Backend server at ${apiUrl} unreachable.`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Account & System Settings</Text>
        <Text style={styles.bannerSub}>
          Manage profile details, language, Motorola Edge pOLED display, and India Post API telemetry.
        </Text>
      </View>

      {/* User Profile Form */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Profile Information</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{currentUser.role.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.inputLabel}>Registered Email</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={currentUser.email} editable={false} />

        <Text style={styles.inputLabel}>Contact Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.inputLabel}>District & Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>💾 Save Profile Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Language Preference */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Language / ભાષા / भाषा</Text>
        <Text style={styles.cardSub}>Choose your preferred language for Daksh AI and export forms.</Text>

        <View style={styles.langList}>
          {LANGUAGES.map(l => {
            const isSelected = selectedLang === l.code;
            return (
              <TouchableOpacity
                key={l.code}
                style={[styles.langItem, isSelected && styles.langItemActive]}
                onPress={() => {
                  setSelectedLang(l.code);
                  Alert.alert('Language Set', `Application language switched to ${l.native}.`);
                }}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={[styles.langNative, isSelected && styles.langNativeActive]}>{l.native}</Text>
                  <Text style={styles.langDesc}>{l.desc}</Text>
                </View>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Device & Experience Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Device & Experience</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>Motorola Edge Curved Padding</Text>
            <Text style={styles.toggleSub}>Optimized 18px safe insets for 3D curved glass</Text>
          </View>
          <Switch value={true} disabled trackColor={{ false: '#CBD5E1', true: '#86EFAC' }} thumbColor="#22C55E" />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>Low-Bandwidth / Rural Mode</Text>
            <Text style={styles.toggleSub}>Compress assets for 2G/3G network areas</Text>
          </View>
          <Switch value={lowBandwidth} onValueChange={setLowBandwidth} trackColor={{ false: '#CBD5E1', true: '#93C5FD' }} thumbColor={lowBandwidth ? '#2563EB' : '#F1F5F9'} />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>SMS Tracking Notifications</Text>
            <Text style={styles.toggleSub}>Receive live India Post SMS updates</Text>
          </View>
          <Switch value={smsAlerts} onValueChange={setSmsAlerts} trackColor={{ false: '#CBD5E1', true: '#93C5FD' }} thumbColor={smsAlerts ? '#2563EB' : '#F1F5F9'} />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>Haptic Feedback</Text>
            <Text style={styles.toggleSub}>Tactile confirmation on buttons & scans</Text>
          </View>
          <Switch value={haptics} onValueChange={setHaptics} trackColor={{ false: '#CBD5E1', true: '#93C5FD' }} thumbColor={haptics ? '#2563EB' : '#F1F5F9'} />
        </View>
      </View>

      {/* Backend API Telemetry */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Backend & AI Telemetry</Text>
        <Text style={styles.cardSub}>Local Django + Groq Multilingual Export LLM API</Text>

        <View style={styles.telemetryBox}>
          <Text style={styles.telemetryLabel}>API Server Endpoint:</Text>
          <Text style={styles.telemetryValue}>{getApiBaseUrl()}</Text>

          <View style={styles.serverStatusRow}>
            <Text style={styles.telemetryLabel}>Status:</Text>
            <Text style={[styles.statusText, serverStatus === 'ONLINE' ? styles.statusOnline : styles.statusIdle]}>
              {serverStatus === 'ONLINE' ? `● Connected (${latencyMs}ms)` : serverStatus === 'CHECKING' ? 'Testing...' : 'Ready'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.pingBtn} onPress={handleTestServer} activeOpacity={0.8}>
          <Text style={styles.pingBtnText}>⚡ Ping API & AI Gateway</Text>
        </TouchableOpacity>
      </View>

      {/* Role Switcher Shortcut */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Switch Active Persona</Text>
        <Text style={styles.cardSub}>Switch between Seller, Buyer, Admin, and Operator portals.</Text>

        <TouchableOpacity style={styles.switchPersonaBtn} onPress={onSwitchUserPrompt} activeOpacity={0.8}>
          <Text style={styles.switchPersonaBtnText}>👥 Open Persona Switcher →</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  banner: {
    backgroundColor: '#102A43',
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 15,
  },
  roleBadge: {
    backgroundColor: '#102A43',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  saveBtn: {
    backgroundColor: '#102A43',
    marginTop: 14,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  langList: {
    gap: 8,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  langItemActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  langNative: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  langNativeActive: {
    color: '#1E40AF',
  },
  langDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 10,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  telemetryBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  telemetryLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  telemetryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  serverStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusOnline: {
    color: '#16A34A',
  },
  statusIdle: {
    color: '#64748B',
  },
  pingBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  pingBtnText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: 'bold',
  },
  switchPersonaBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  switchPersonaBtnText: {
    color: '#C62828',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
