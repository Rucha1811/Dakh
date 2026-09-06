import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { PRODUCTS, Product } from '../data/mobileData';
import ProductCard from '../components/ProductCard';

export default function MarketplaceScreen() {
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Handicrafts', 'Textiles', 'Home Decor'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(prod => {
      const matchCat = category === 'All' || prod.category === category;
      const matchSearch = prod.name.toLowerCase().includes(search.toLowerCase()) ||
                          prod.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const handleProductPress = (prod: Product) => {
    Alert.alert(
      prod.name,
      `Price: ₹${prod.price.toLocaleString('en-IN')}\nWeight: ${prod.weight} kg\nHS Code: ${prod.hsCode || 'N/A'}\nOrigin: ${prod.countryOfOrigin}\n\n${prod.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request International Quote',
          onPress: () => Alert.alert('RFQ Submitted', `Your export inquiry for "${prod.name}" has been sent to the artisan!`),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Global Buyer Marketplace</Text>
        <Text style={styles.subtitle}>Verified Indian handicrafts & textiles with export clearance</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search products by craft, material, or keyword..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Pills */}
      <View style={styles.catScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map(cat => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, isSelected && styles.pillActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredProducts.map(prod => (
          <ProductCard
            key={prod.id}
            product={prod}
            onPress={() => handleProductPress(prod)}
          />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#102A43',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#CBD5E1',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
  },
  catScrollContainer: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pillActive: {
    backgroundColor: '#102A43',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
    paddingTop: 8,
  },
});
