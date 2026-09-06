import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { PRODUCTS, SHIPMENTS } from '../data/mobileData';

interface BuyerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export default function BuyerDashboardScreen({ onNavigateTab }: BuyerDashboardProps) {
  const buyerOrders = SHIPMENTS;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Motorola Edge 70 Curved Buyer Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Welcome back, Hans!</Text>
            <Text style={styles.heroLocation}>📍 Munich, Germany • Verified International Importer</Text>
          </View>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencyText}>EUR / USD</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLbl}>Total Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.heroStat}>
            <Text style={[styles.statNum, { color: '#FCD34D' }]}>2</Text>
            <Text style={styles.statLbl}>In Air Transit</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.heroStat}>
            <Text style={[styles.statNum, { color: '#86EFAC' }]}>2</Text>
            <Text style={styles.statLbl}>Delivered</Text>
          </View>
        </View>
      </View>

      {/* Quick Buyer Navigation Tools */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Buyer Services</Text>
      </View>

      <View style={styles.toolsGrid}>
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#F0FDFA', borderColor: '#99F6E4' }]}
          onPress={() => onNavigateTab('marketplace')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>🛍️</Text>
          <Text style={[styles.toolTitle, { color: '#0F766E' }]}>Browse Catalog</Text>
          <Text style={styles.toolSub}>Verified Indian Handicrafts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
          onPress={() => onNavigateTab('shipments')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>✈️</Text>
          <Text style={[styles.toolTitle, { color: '#1E40AF' }]}>Track Shipments</Text>
          <Text style={styles.toolSub}>Live Germany/EU delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }]}
          onPress={() => onNavigateTab('assistant')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>🤖</Text>
          <Text style={[styles.toolTitle, { color: '#6B21A8' }]}>Daksh AI</Text>
          <Text style={styles.toolSub}>Customs & Tariffs Advisor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
          onPress={() => onNavigateTab('calculator')}
          activeOpacity={0.7}
        >
          <Text style={styles.toolIcon}>🧮</Text>
          <Text style={[styles.toolTitle, { color: '#991B1B' }]}>Landed Duties</Text>
          <Text style={styles.toolSub}>EU Import VAT estimator</Text>
        </TouchableOpacity>
      </View>

      {/* In-Flight International Orders */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active International Purchases</Text>
        <TouchableOpacity onPress={() => onNavigateTab('shipments')}>
          <Text style={styles.seeAll}>Track All →</Text>
        </TouchableOpacity>
      </View>

      {buyerOrders.map(order => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderTop}>
            <View>
              <Text style={styles.orderTracking}>{order.trackingNumber}</Text>
              <Text style={styles.orderCarrier}>{order.carrier} • Origin: Gujarat, India</Text>
            </View>
            <View style={styles.orderStatusBadge}>
              <Text style={styles.orderStatusText}>{order.status}</Text>
            </View>
          </View>

          <Text style={styles.orderDesc}>{order.itemDescription}</Text>
          <View style={styles.orderBottom}>
            <Text style={styles.orderEta}>Est. Delivery: <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{order.estimatedDelivery}</Text></Text>
            <TouchableOpacity onPress={() => onNavigateTab('shipments')}>
              <Text style={styles.trackBtnText}>View Milestones ↗</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Recommended Artisanal Crafts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Authentic Indian Crafts</Text>
        <TouchableOpacity onPress={() => onNavigateTab('marketplace')}>
          <Text style={styles.seeAll}>Explore All →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCrafts}>
        {PRODUCTS.map(p => (
          <TouchableOpacity
            key={p.id}
            style={styles.craftCard}
            onPress={() => onNavigateTab('marketplace')}
            activeOpacity={0.85}
          >
            <Image source={{ uri: p.images[0] }} style={styles.craftImg} />
            <View style={styles.craftBody}>
              <Text style={styles.craftCategory}>{p.category.toUpperCase()}</Text>
              <Text style={styles.craftName} numberOfLines={2}>{p.name}</Text>
              <Text style={styles.craftPrice}>${Math.round(p.price / 85)} USD <Text style={styles.inrSub}>(₹{p.price})</Text></Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    backgroundColor: '#0F766E',
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
    marginBottom: 16,
  },
  heroGreeting: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroLocation: {
    fontSize: 11,
    color: '#CCFBF1',
    marginTop: 2,
  },
  currencyBadge: {
    backgroundColor: '#115E59',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currencyText: {
    color: '#99F6E4',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#134E4A',
    borderRadius: 16,
    paddingVertical: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heroStat: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLbl: {
    fontSize: 10,
    color: '#99F6E4',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#115E59',
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
    color: '#0D9488',
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
  orderCard: {
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
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderTracking: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#0F172A',
  },
  orderCarrier: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  orderStatusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  orderDesc: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    marginBottom: 10,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  orderEta: {
    fontSize: 11,
    color: '#64748B',
  },
  trackBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  horizontalCrafts: {
    paddingHorizontal: 16,
    gap: 12,
  },
  craftCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  craftImg: {
    width: '100%',
    height: 110,
    backgroundColor: '#E2E8F0',
  },
  craftBody: {
    padding: 10,
  },
  craftCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0D9488',
    marginBottom: 2,
  },
  craftName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 16,
    marginBottom: 6,
  },
  craftPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  inrSub: {
    fontSize: 10,
    fontWeight: 'normal',
    color: '#64748B',
  },
});
