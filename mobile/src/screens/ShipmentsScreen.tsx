import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SHIPMENTS, Shipment } from '../data/mobileData';

export default function ShipmentsScreen() {
  const [shipments] = useState<Shipment[]>(SHIPMENTS);
  const [searchTracking, setSearchTracking] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(SHIPMENTS[0]);

  const filtered = shipments.filter(s =>
    s.trackingNumber.toLowerCase().includes(searchTracking.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTracking.toLowerCase()) ||
    s.buyerName.toLowerCase().includes(searchTracking.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>International Parcel Tracking</Text>
        <Text style={styles.bannerSub}>
          Real-time India Post EMS tracking linked to Ahmedabad Foreign Post Office (FPO) and global postal gateways.
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search Tracking ID (e.g. IN-EMS-784910234)..."
          placeholderTextColor="#94A3B8"
          value={searchTracking}
          onChangeText={setSearchTracking}
        />
      </View>

      {/* Active Shipment Details Card */}
      <View style={styles.activeCard}>
        <View style={styles.activeHeader}>
          <View>
            <Text style={styles.trackingNum}>{selectedShipment.trackingNumber}</Text>
            <Text style={styles.carrierText}>{selectedShipment.carrier}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{selectedShipment.status}</Text>
          </View>
        </View>

        <Text style={styles.itemTitle}>{selectedShipment.itemDescription}</Text>
        <Text style={styles.buyerText}>Buyer: {selectedShipment.buyerName}</Text>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${selectedShipment.progress}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressSub}>DNK Center</Text>
            <Text style={styles.progressSub}>Customs</Text>
            <Text style={styles.progressSub}>Air Transit</Text>
            <Text style={styles.progressSub}>Delivered</Text>
          </View>
        </View>

        {/* Milestone Timeline */}
        <Text style={styles.timelineTitle}>Tracking History & Checkpoints</Text>
        <View style={styles.timelineList}>
          {selectedShipment.timeline.map((step, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, step.done && styles.timelineDotDone]} />
                {idx < selectedShipment.timeline.length - 1 && (
                  <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                )}
              </View>
              <View style={styles.timelineRight}>
                <Text style={[styles.stepTitle, step.done && styles.stepTitleDone]}>{step.title}</Text>
                <Text style={styles.stepLocation}>{step.location} • <Text style={styles.stepDate}>{step.date}</Text></Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* All Shipments List */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>All Active International Shipments ({filtered.length})</Text>
        {filtered.map(s => {
          const isCurrent = s.id === selectedShipment.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.shipmentCard, isCurrent && styles.shipmentCardActive]}
              onPress={() => setSelectedShipment(s)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTracking}>{s.trackingNumber}</Text>
                <Text style={styles.cardDest}>✈️ {s.destination}</Text>
              </View>
              <Text style={styles.cardDesc} numberOfLines={1}>{s.itemDescription}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardEta}>Est. Delivery: {s.estimatedDelivery}</Text>
                <Text style={styles.cardStatus}>{s.status}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 12,
    color: '#0F172A',
  },
  activeCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackingNum: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'monospace',
  },
  carrierText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 4,
  },
  buyerText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressSub: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
  },
  timelineDotDone: {
    backgroundColor: '#16A34A',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
    minHeight: 32,
  },
  timelineLineDone: {
    backgroundColor: '#86EFAC',
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 14,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stepTitleDone: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  stepLocation: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  stepDate: {
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  shipmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  shipmentCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTracking: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'monospace',
  },
  cardDest: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  cardDesc: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 6,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 4,
  },
  cardEta: {
    fontSize: 10,
    color: '#64748B',
  },
  cardStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16A34A',
  },
});
