import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

interface SellerProfile {
  id: string;
  name: string;
  businessName: string;
  district: string;
  craft: string;
  productsCount: number;
  totalExports: number;
  status: 'Verified' | 'Pending KYC';
}

const REGISTERED_SELLERS: SellerProfile[] = [
  { id: 'SEL001', name: 'Meera Patel', businessName: 'Meera Handicrafts', district: 'Ahmedabad', craft: 'Teak Wood & Inlay Decor', productsCount: 12, totalExports: 48, status: 'Verified' },
  { id: 'SEL002', name: 'Kanti Vankar', businessName: 'Kutch Weavers Co-op', district: 'Bhuj', craft: 'Bhujodi Handloom Shawls', productsCount: 34, totalExports: 120, status: 'Verified' },
  { id: 'SEL003', name: 'Arif Khatri', businessName: 'Ajrakhpur Prints', district: 'Bhuj', craft: 'Natural Dye Ajrakh Textiles', productsCount: 18, totalExports: 64, status: 'Verified' },
  { id: 'SEL004', name: 'Dharmesh Soni', businessName: 'Saurashtra Brass Works', district: 'Jamnagar', craft: 'Brass Handicrafts & Parts', productsCount: 22, totalExports: 35, status: 'Pending KYC' },
  { id: 'SEL005', name: 'Pooja Rawal', businessName: 'Surat Zari Creations', district: 'Surat', craft: 'Traditional Zari Embroidery', productsCount: 15, totalExports: 42, status: 'Verified' },
];

export default function AdminSellersScreen() {
  const [search, setSearch] = useState('');
  const [sellers] = useState<SellerProfile[]>(REGISTERED_SELLERS);

  const filtered = sellers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.businessName.toLowerCase().includes(search.toLowerCase()) ||
    s.district.toLowerCase().includes(search.toLowerCase()) ||
    s.craft.toLowerCase().includes(search.toLowerCase())
  );

  const handleSellerDetail = (s: SellerProfile) => {
    Alert.alert(
      s.businessName,
      `Proprietor: ${s.name}\nDistrict: ${s.district}, Gujarat\nCraft: ${s.craft}\nTotal Exports: ${s.totalExports} parcels\nStatus: ${s.status}`,
      [{ text: 'Close' }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Registered MSME Artisans & Exporters</Text>
        <Text style={styles.bannerSub}>
          Explore 428 registered Gujarat craft enterprises enabled for assisted cross-border postal exports.
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by Artisan, Craft, or District..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.list}>
        {filtered.map(s => {
          const isVerified = s.status === 'Verified';
          return (
            <TouchableOpacity
              key={s.id}
              style={styles.card}
              onPress={() => handleSellerDetail(s)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardTopLeft}>
                  <Text style={styles.bizName}>{s.businessName}</Text>
                  <Text style={styles.proprietor}>{s.name} • 📍 {s.district}, Gujarat</Text>
                </View>
                <View style={[styles.badge, isVerified ? styles.badgeVer : styles.badgePen]}>
                  <Text style={[styles.badgeText, isVerified ? styles.textVer : styles.textPen]}>
                    {s.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.craft}>{s.craft}</Text>

              <View style={styles.statsRow}>
                <Text style={styles.statText}>Products: <Text style={styles.bold}>{s.productsCount}</Text></Text>
                <Text style={styles.statText}>Total Exports: <Text style={[styles.bold, { color: '#16A34A' }]}>{s.totalExports} pkgs</Text></Text>
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTopLeft: {
    flex: 1,
    marginRight: 8,
  },
  bizName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  proprietor: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeVer: {
    backgroundColor: '#DCFCE7',
  },
  badgePen: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  textVer: {
    color: '#16A34A',
  },
  textPen: {
    color: '#B45309',
  },
  craft: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  statText: {
    fontSize: 11,
    color: '#64748B',
  },
  bold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
});
