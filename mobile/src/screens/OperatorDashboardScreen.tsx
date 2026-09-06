import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GUJARAT_DNKS } from '../data/mobileData';

interface OperatorDashboardProps {
  onNavigateTab: (tab: string) => void;
}

interface WalkinSeller {
  id: string;
  name: string;
  craft: string;
  itemsCount: number;
  destination: string;
  status: 'Waiting' | 'Verifying' | 'Completed';
}

export default function OperatorDashboardScreen({ onNavigateTab }: OperatorDashboardProps) {
  const [queue, setQueue] = useState<WalkinSeller[]>([
    { id: 'Q01', name: 'Ramesh Vankar', craft: 'Bhujodi Shawls', itemsCount: 6, destination: 'United Kingdom', status: 'Waiting' },
    { id: 'Q02', name: 'Leela Ben', craft: 'Mata Ni Pachedi Wall Hanging', itemsCount: 2, destination: 'United States', status: 'Verifying' },
    { id: 'Q03', name: 'Arif Khatri', craft: 'Ajrakh Block Prints', itemsCount: 15, destination: 'Germany', status: 'Completed' },
  ]);

  const handleProcessQueue = (item: WalkinSeller) => {
    Alert.alert(
      `Assisted Export Intake: ${item.name}`,
      `Craft: ${item.craft}\nItems: ${item.itemsCount} parcels\nDestination: ${item.destination}\nStatus: ${item.status}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '⚡ Generate PBE-III & Seal Parcel',
          onPress: () => {
            setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'Completed' } : q));
            Alert.alert('Parcel Sealed', `Customs packaging complete. Postal Bill of Export generated for ${item.name}.`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Operator Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Ahmedabad GPO DNK Counter</Text>
            <Text style={styles.heroSub}>Operator Portal: Rajesh Kumar (Officer ID: DNK-781)</Text>
          </View>
          <View style={styles.hubBadge}>
            <Text style={styles.hubBadgeText}>DNK #001</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLbl}>Sellers Assisted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.heroStat}>
            <Text style={[styles.statNum, { color: '#FCD34D' }]}>5</Text>
            <Text style={styles.statLbl}>In Queue</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.heroStat}>
            <Text style={[styles.statNum, { color: '#86EFAC' }]}>₹62.4k</Text>
            <Text style={styles.statLbl}>Postage Booked</Text>
          </View>
        </View>
      </View>

      {/* Operator Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Counter Operations</Text>
      </View>

      <View style={styles.toolsGrid}>
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
          onPress={() => onNavigateTab('calculator')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>⚖️</Text>
          <Text style={[styles.toolTitle, { color: '#1E40AF' }]}>Weigh & Rate</Text>
          <Text style={styles.toolSub}>EMS Volumetric Check</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }]}
          onPress={() => onNavigateTab('documents')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>📋</Text>
          <Text style={[styles.toolTitle, { color: '#6B21A8' }]}>PBE-III Filing</Text>
          <Text style={styles.toolSub}>Customs Declaration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
          onPress={() => onNavigateTab('shipments')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>📦</Text>
          <Text style={[styles.toolTitle, { color: '#991B1B' }]}>Dispatch Manifest</Text>
          <Text style={styles.toolSub}>Ahmedabad FPO Bagging</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
          onPress={() => onNavigateTab('assistant')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>🤖</Text>
          <Text style={[styles.toolTitle, { color: '#166534' }]}>Daksh AI Support</Text>
          <Text style={styles.toolSub}>HS Code & Tariff Query</Text>
        </TouchableOpacity>
      </View>

      {/* Walk-in Artisan Queue */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Walk-in Artisan Queue</Text>
      </View>

      {queue.map(item => {
        const isCompleted = item.status === 'Completed';
        const isVerifying = item.status === 'Verifying';
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.queueCard}
            onPress={() => handleProcessQueue(item)}
            activeOpacity={0.8}
          >
            <View style={styles.queueTop}>
              <View style={styles.queueLeft}>
                <Text style={styles.queueName}>{item.name}</Text>
                <Text style={styles.queueCraft}>{item.craft} • {item.itemsCount} boxes</Text>
              </View>
              <View style={[
                styles.statusBadge,
                isCompleted ? styles.badgeDone : isVerifying ? styles.badgeVerifying : styles.badgeWaiting
              ]}>
                <Text style={[
                  styles.statusText,
                  isCompleted ? styles.textDone : isVerifying ? styles.textVerifying : styles.textWaiting
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.queueBottom}>
              <Text style={styles.destText}>✈️ Export to: <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{item.destination}</Text></Text>
              <Text style={styles.actionPrompt}>
                {isCompleted ? '✓ Manifested' : 'Process Intake →'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

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
    backgroundColor: '#C77C02',
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
    marginBottom: 14,
  },
  heroGreeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 11,
    color: '#FEF3C7',
    marginTop: 2,
  },
  hubBadge: {
    backgroundColor: '#92400E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hubBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FDE68A',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#92400E',
    borderRadius: 16,
    paddingVertical: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heroStat: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLbl: {
    fontSize: 10,
    color: '#FDE68A',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#B45309',
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
  queueCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  queueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  queueLeft: {
    flex: 1,
  },
  queueName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  queueCraft: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeWaiting: {
    backgroundColor: '#FEF3C7',
  },
  badgeVerifying: {
    backgroundColor: '#EFF6FF',
  },
  badgeDone: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  textWaiting: {
    color: '#B45309',
  },
  textVerifying: {
    color: '#1E40AF',
  },
  textDone: {
    color: '#16A34A',
  },
  queueBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  destText: {
    fontSize: 11,
    color: '#64748B',
  },
  actionPrompt: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C77C02',
  },
});
