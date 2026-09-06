import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GUJARAT_DNKS, SHIPMENTS } from '../data/mobileData';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export default function AdminDashboardScreen({ onNavigateTab }: AdminDashboardProps) {
  const metrics = [
    { label: 'Total MSME Sellers', value: '428', icon: '👥', color: '#1E40AF', bg: '#EFF6FF', change: '+24 this week' },
    { label: 'Active Gujarat DNKs', value: `${GUJARAT_DNKS.length}`, icon: '🏛️', color: '#16A34A', bg: '#F0FDF4', change: '100% Operational' },
    { label: 'Total Export Value', value: '₹1.42 Cr', icon: '💰', color: '#D97706', bg: '#FEF3C7', change: '+18.4% MoM' },
    { label: 'FPO Clearance Rate', value: '94.8%', icon: '⚡', color: '#7C3AED', bg: '#F5F3FF', change: 'Ahmedabad FPO' },
    { label: 'Total Shipments', value: '1,840', icon: '📦', color: '#2563EB', bg: '#EFF6FF', change: '1,720 Delivered' },
    { label: 'Customs Pending', value: '14', icon: '⚠️', color: '#DC2626', bg: '#FEF2F2', change: 'Action Required' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Admin Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroTitle}>National DNK Portal</Text>
            <Text style={styles.heroSub}>Department of Posts & CBIC Export Monitoring</Text>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live Telemetry</Text>
          </View>
        </View>

        <View style={styles.adminSummaryBox}>
          <Text style={styles.summaryText}>
            🏛️ Gujarat Circle leads western zone exports with 13 functional DNKs and ₹1.42 Cr commercial handicrafts & MSME dispatches in FY26.
          </Text>
        </View>
      </View>

      {/* KPI Grid */}
      <View style={styles.metricsGrid}>
        {metrics.map((m, idx) => (
          <View key={idx} style={styles.metricCard}>
            <View style={styles.metricTop}>
              <View style={[styles.iconBox, { backgroundColor: m.bg }]}>
                <Text style={styles.metricIcon}>{m.icon}</Text>
              </View>
              <Text style={styles.metricChange}>{m.change}</Text>
            </View>
            <Text style={[styles.metricVal, { color: m.color }]}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Admin Quick Action Navigation */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Administrative Actions</Text>
      </View>

      <View style={styles.toolsGrid}>
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
          onPress={() => onNavigateTab('compliance')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>📋</Text>
          <Text style={[styles.toolTitle, { color: '#1E40AF' }]}>Compliance Approvals</Text>
          <Text style={styles.toolSub}>5 KYC & PBE-III Queued</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
          onPress={() => onNavigateTab('sellers')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>👥</Text>
          <Text style={[styles.toolTitle, { color: '#166534' }]}>Sellers Directory</Text>
          <Text style={styles.toolSub}>428 Registered Artisans</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
          onPress={() => onNavigateTab('dnk')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>📍</Text>
          <Text style={[styles.toolTitle, { color: '#991B1B' }]}>DNK Centers Network</Text>
          <Text style={styles.toolSub}>13 Gujarat Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }]}
          onPress={() => onNavigateTab('shipments')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>✈️</Text>
          <Text style={[styles.toolTitle, { color: '#6B21A8' }]}>FPO Gateway Monitor</Text>
          <Text style={styles.toolSub}>Air Cargo Dispatches</Text>
        </TouchableOpacity>
      </View>

      {/* Gujarat Post Office Hubs Performance */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gujarat High-Volume Export Hubs</Text>
        <TouchableOpacity onPress={() => onNavigateTab('dnk')}>
          <Text style={styles.seeAll}>View All 13 →</Text>
        </TouchableOpacity>
      </View>

      {GUJARAT_DNKS.slice(0, 3).map(dnk => (
        <View key={dnk.id} style={styles.hubCard}>
          <View style={styles.hubHeader}>
            <Text style={styles.hubName}>{dnk.name}</Text>
            <View style={styles.hubBadge}>
              <Text style={styles.hubBadgeText}>Active</Text>
            </View>
          </View>
          <Text style={styles.hubAddress}>{dnk.address}</Text>
          <View style={styles.hubFooter}>
            <Text style={styles.hubPin}>PIN: {dnk.pinCode} • District: {dnk.district}</Text>
            <Text style={styles.hubHours}>{dnk.operatingHours}</Text>
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#1E3A8A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 2,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172554',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#86EFAC',
  },
  adminSummaryBox: {
    backgroundColor: '#1E40AF',
    padding: 12,
    borderRadius: 14,
  },
  summaryText: {
    fontSize: 11,
    color: '#DBEAFE',
    lineHeight: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIcon: {
    fontSize: 14,
  },
  metricChange: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  toolBtn: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  toolIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  toolSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  hubCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hubName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  hubBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hubBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  hubAddress: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 6,
  },
  hubFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 4,
  },
  hubPin: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  hubHours: {
    fontSize: 10,
    color: '#64748B',
  },
});
