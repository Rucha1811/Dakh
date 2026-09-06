import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GUJARAT_DNKS, DNK } from '../data/mobileData';
import DNKCard from '../components/DNKCard';
import GujaratVisualMap from '../components/GujaratVisualMap';

export default function GujaratDNKScreen() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [selectedDnk, setSelectedDnk] = useState<DNK>(GUJARAT_DNKS[0]);

  const districts = ['All', 'Ahmedabad', 'Surat', 'Bhuj', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Jamnagar', 'Bhavnagar', 'Anand', 'Junagadh', 'Mehsana', 'Bharuch'];

  const filteredDnks = useMemo(() => {
    return GUJARAT_DNKS.filter(dnk => {
      const matchDist = selectedDistrict === 'All' || dnk.district.toLowerCase() === selectedDistrict.toLowerCase();
      const q = search.toLowerCase();
      const matchSearch =
        dnk.name.toLowerCase().includes(q) ||
        dnk.address.toLowerCase().includes(q) ||
        dnk.district.toLowerCase().includes(q) ||
        dnk.pinCode.includes(q);
      return matchDist && matchSearch;
    });
  }, [selectedDistrict, search]);

  const handleNearestDnk = () => {
    const bhadra = GUJARAT_DNKS[0];
    setSelectedDnk(bhadra);
    setSelectedDistrict('Ahmedabad');
    Alert.alert(
      'Nearest DNK Located',
      'Ahmedabad Head Post Office GPO DNK (Bhadra) is 2.4 km from your artisan workshop. Export counters open until 6:00 PM.'
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerTitle}>Gujarat DNK Export Network</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filteredDnks.length} Hubs</Text>
          </View>
        </View>
        <Text style={styles.bannerSub}>
          13 Post office export counters across Ahmedabad, Surat, Kutch/Bhuj, and Gujarat
        </Text>

        <TouchableOpacity style={styles.gpsBtn} onPress={handleNearestDnk} activeOpacity={0.8}>
          <Text style={styles.gpsBtnText}>📍 Find Nearest DNK (GPS Assist)</Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle: Interactive Map vs List View */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
          onPress={() => setViewMode('map')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            🗺️ Interactive Leaflet Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
          onPress={() => setViewMode('list')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            📋 All 13 Hubs List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by city, PIN code, or facility name..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* District Filter Pills */}
      <View style={styles.pillsScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
          {districts.map(dist => {
            const isSelected = selectedDistrict === dist;
            return (
              <TouchableOpacity
                key={dist}
                style={[styles.pill, isSelected && styles.pillActive]}
                onPress={() => setSelectedDistrict(dist)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                  {dist === 'All' ? 'All Districts' : dist}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Conditional Rendering: Real Leaflet Map or Cards List */}
      {viewMode === 'map' ? (
        <GujaratVisualMap
          dnks={filteredDnks}
          selectedDnk={selectedDnk}
          onSelectDnk={(d) => setSelectedDnk(d)}
          selectedDistrict={selectedDistrict}
        />
      ) : (
        <View style={styles.listContainer}>
          {filteredDnks.map(dnk => (
            <DNKCard
              key={dnk.id}
              dnk={dnk}
              isSelected={selectedDnk.id === dnk.id}
              onSelect={() => setSelectedDnk(dnk)}
            />
          ))}
        </View>
      )}

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#C62828',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bannerSub: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    marginBottom: 12,
  },
  gpsBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334E68',
  },
  gpsBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleTextActive: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 12,
    color: '#0F172A',
  },
  pillsScrollContainer: {
    marginTop: 10,
    marginBottom: 4,
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  pillText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 4,
  },
});
