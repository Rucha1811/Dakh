import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

interface ComplianceItem {
  id: string;
  sellerName: string;
  companyName: string;
  docType: string;
  iecCode: string;
  gstin: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  date: string;
}

export default function AdminComplianceScreen() {
  const [items, setItems] = useState<ComplianceItem[]>([
    {
      id: 'CMP-101',
      sellerName: 'Meera Patel',
      companyName: 'Meera Handicrafts',
      docType: 'PBE-III & LUT Exemption',
      iecCode: '0421098451',
      gstin: '24AAAAA0000A1Z5',
      status: 'Approved',
      date: 'Today, 10:15 AM',
    },
    {
      id: 'CMP-102',
      sellerName: 'Kanti Vankar',
      companyName: 'Kutch Weavers Co-op',
      docType: 'Certificate of Origin (CoO)',
      iecCode: '0421098489',
      gstin: '24BBBBB1111B2Z6',
      status: 'Pending Review',
      date: 'Today, 09:30 AM',
    },
    {
      id: 'CMP-103',
      sellerName: 'Dharmesh Soni',
      companyName: 'Saurashtra Brass Works',
      docType: 'Postal Export Declaration',
      iecCode: '0421098555',
      gstin: '24CCCCC2222C3Z7',
      status: 'Pending Review',
      date: 'Yesterday',
    },
  ]);

  const handleAction = (item: ComplianceItem) => {
    Alert.alert(
      `Compliance Review: ${item.companyName}`,
      `Seller: ${item.sellerName}\nDocument: ${item.docType}\nIEC Code: ${item.iecCode}\nGSTIN: ${item.gstin}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '✓ Approve Filing',
          onPress: () => {
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Approved' } : i));
            Alert.alert('Approved', `${item.docType} for ${item.companyName} has been approved for DNK export dispatch.`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Customs & KYC Compliance Queue</Text>
        <Text style={styles.bannerSub}>
          Verify Importer-Exporter Codes (IEC), GST Letter of Undertaking, and Postal Bill of Export declarations.
        </Text>
      </View>

      <View style={styles.list}>
        {items.map(item => {
          const isApproved = item.status === 'Approved';
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleAction(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.companyName}>{item.companyName}</Text>
                  <Text style={styles.sellerName}>{item.sellerName} • {item.date}</Text>
                </View>
                <View style={[styles.badge, isApproved ? styles.badgeApproved : styles.badgePending]}>
                  <Text style={[styles.badgeText, isApproved ? styles.textApproved : styles.textPending]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.docType}>Filing: <Text style={styles.bold}>{item.docType}</Text></Text>

              <View style={styles.idRow}>
                <Text style={styles.idText}>IEC: <Text style={styles.mono}>{item.iecCode}</Text></Text>
                <Text style={styles.idText}>GSTIN: <Text style={styles.mono}>{item.gstin}</Text></Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.actionText}>
                  {isApproved ? '✓ Cleared by Admin' : 'Review & Approve →'}
                </Text>
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
    backgroundColor: '#1E3A8A',
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
    color: '#BFDBFE',
    lineHeight: 16,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sellerName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeApproved: {
    backgroundColor: '#DCFCE7',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  textApproved: {
    color: '#16A34A',
  },
  textPending: {
    color: '#B45309',
  },
  docType: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  idText: {
    fontSize: 10,
    color: '#64748B',
  },
  mono: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardFooter: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  actionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
  },
});
