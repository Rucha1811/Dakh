import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Product } from '../data/mobileData';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'IN_PROGRESS': return { bg: '#FEF9C3', text: '#CA8A04' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const statusStyle = getStatusColor(product.exportStatus);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: product.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {product.exportStatus.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>{product.name}</Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            ₹{product.price.toLocaleString('en-IN')}
          </Text>
          {product.hsCode ? (
            <View style={styles.hsBadge}>
              <Text style={styles.hsText}>HS: {product.hsCode}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#102A43',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C62828',
  },
  hsBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hsText: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'monospace',
  },
});
