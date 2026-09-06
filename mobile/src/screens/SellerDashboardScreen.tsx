import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PRODUCTS, SHIPMENTS } from '../data/mobileData';
import ProductCard from '../components/ProductCard';

interface SellerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export default function SellerDashboardScreen({ onNavigateTab }: SellerDashboardProps) {
  const readinessScore = 92;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Motorola Edge 70 Curved Hero Readiness Banner */}
      <View style={styles.heroCard}>
        <View style={styles.readinessContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{readinessScore}%</Text>
            <Text style={styles.scoreLabel}>Ready</Text>
          </View>

          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Export Readiness High</Text>
            <Text style={styles.heroSubtitle}>
              Meera Handicrafts is eligible for assisted export via Dak Ghar Niryat Kendra.
            </Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>✓ IEC Code Verified</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick KPI Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Sales</Text>
          <Text style={styles.statValue}>₹48,500</Text>
          <Text style={styles.statSub}>+18% this month</Text>
        </View>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => onNavigateTab('shipments')}
          activeOpacity={0.8}
        >
          <Text style={styles.statLabel}>Active Orders</Text>
          <Text style={[styles.statValue, { color: '#2563EB' }]}>4</Text>
          <Text style={styles.statSub}>2 in international transit →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => onNavigateTab('marketplace')}
          activeOpacity={0.8}
        >
          <Text style={styles.statLabel}>Export Products</Text>
          <Text style={[styles.statValue, { color: '#0D9488' }]}>{PRODUCTS.length}</Text>
          <Text style={styles.statSub}>Catalog items →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => onNavigateTab('dnk')}
          activeOpacity={0.8}
        >
          <Text style={styles.statLabel}>Nearest DNK</Text>
          <Text style={[styles.statValue, { color: '#C62828' }]}>Bhadra HPO</Text>
          <Text style={styles.statSub}>Ahmedabad (2.4 km) →</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Grid Navigation (Matching Website Features) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Export Tools & Features</Text>
      </View>

      <View style={styles.toolsGrid}>
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
          onPress={() => onNavigateTab('assistant')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>🤖</Text>
          <Text style={[styles.toolTitle, { color: '#1E40AF' }]}>Daksh AI</Text>
          <Text style={styles.toolSub}>Multilingual Groq Advisor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
          onPress={() => onNavigateTab('dnk')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>📍</Text>
          <Text style={[styles.toolTitle, { color: '#991B1B' }]}>Gujarat DNKs</Text>
          <Text style={styles.toolSub}>13 Post office hubs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
          onPress={() => onNavigateTab('calculator')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>🧮</Text>
          <Text style={[styles.toolTitle, { color: '#166534' }]}>Cost Calculator</Text>
          <Text style={styles.toolSub}>Landed duties & EMS rates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }]}
          onPress={() => onNavigateTab('documents')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>📄</Text>
          <Text style={[styles.toolTitle, { color: '#6B21A8' }]}>Export Docs</Text>
          <Text style={styles.toolSub}>PBE-III, IEC, LUT generator</Text>
        </TouchableOpacity>
      </View>

      {/* Active International Shipment Live Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active International Shipment</Text>
        <TouchableOpacity onPress={() => onNavigateTab('shipments')}>
          <Text style={styles.seeAll}>All Shipments →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.liveShipmentCard}
        onPress={() => onNavigateTab('shipments')}
        activeOpacity={0.85}
      >
        <View style={styles.liveShipmentHeader}>
          <View>
            <Text style={styles.liveTracking}>{SHIPMENTS[0].trackingNumber}</Text>
            <Text style={styles.liveDest}>✈️ Destination: {SHIPMENTS[0].destination}</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>{SHIPMENTS[0].status}</Text>
          </View>
        </View>
        <Text style={styles.liveItem}>{SHIPMENTS[0].itemDescription}</Text>
        <Text style={styles.liveEta}>Estimated Delivery: <Text style={{ fontWeight: 'bold', color: '#102A43' }}>{SHIPMENTS[0].estimatedDelivery}</Text></Text>
      </TouchableOpacity>

      {/* Products Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Export Catalog</Text>
        <TouchableOpacity onPress={() => onNavigateTab('marketplace')}>
          <Text style={styles.seeAll}>Marketplace →</Text>
        </TouchableOpacity>
      </View>

      {PRODUCTS.slice(0, 3).map((prod) => (
        <ProductCard key={prod.id} product={prod} />
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
    backgroundColor: '#102A43',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  readinessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#22C55E',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#86EFAC',
    fontWeight: '600',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    marginBottom: 8,
  },
  heroBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 18,
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
    color: '#C62828',
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
  liveShipmentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  liveShipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  liveTracking: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#0F172A',
  },
  liveDest: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 1,
  },
  liveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  liveItem: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  liveEta: {
    fontSize: 11,
    color: '#64748B',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
});
