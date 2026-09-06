import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { DNK } from '../data/mobileData';

interface DNKCardProps {
  dnk: DNK;
  onSelect?: () => void;
  isSelected?: boolean;
}

export default function DNKCard({ dnk, onSelect, isSelected }: DNKCardProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${dnk.contactPhone}`).catch(() => {
      Alert.alert('Call Error', 'Could not open phone dialer.');
    });
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dnk.lat},${dnk.lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Navigation Error', 'Could not open Google Maps.');
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.districtBadge}>
          <Text style={styles.districtText}>{dnk.district}, Gujarat</Text>
        </View>
        <View style={[styles.statusBadge, dnk.status === 'Open' ? styles.openBadge : styles.closedBadge]}>
          <Text style={[styles.statusText, dnk.status === 'Open' ? styles.openText : styles.closedText]}>
            {dnk.status}
          </Text>
        </View>
      </View>

      <Text style={styles.name}>{dnk.name}</Text>
      <Text style={styles.address}>{dnk.address}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.pinCode}>PIN: <Text style={styles.pinBold}>{dnk.pinCode}</Text></Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.hours}>🕒 {dnk.operatingHours}</Text>
      </View>

      <View style={styles.servicesContainer}>
        {dnk.services.map((service, index) => (
          <View key={index} style={styles.serviceTag}>
            <Text style={styles.serviceText}>✓ {service}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>📞 Call Counter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleNavigate}>
          <Text style={styles.navButtonText}>📍 Directions</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#C62828',
    borderWidth: 2,
    backgroundColor: '#FFFBFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  districtBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  districtText: {
    color: '#C62828',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: '#DCFCE7',
  },
  closedBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  openText: {
    color: '#16A34A',
  },
  closedText: {
    color: '#DC2626',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pinCode: {
    fontSize: 11,
    color: '#64748B',
  },
  pinBold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  dot: {
    marginHorizontal: 6,
    color: '#CBD5E1',
  },
  hours: {
    fontSize: 11,
    color: '#64748B',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  serviceText: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#102A43',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
