import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

interface CountryRate {
  name: string;
  code: string;
  flag: string;
  baseRatePerKg: number;
  dutyRatePercent: number;
  deliveryDays: string;
}

const COUNTRIES: CountryRate[] = [
  { name: 'Germany', code: 'DE', flag: '🇩🇪', baseRatePerKg: 1450, dutyRatePercent: 6.5, deliveryDays: '5–7 Days' },
  { name: 'United States', code: 'US', flag: '🇺🇸', baseRatePerKg: 1650, dutyRatePercent: 5.0, deliveryDays: '6–8 Days' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', baseRatePerKg: 1500, dutyRatePercent: 6.0, deliveryDays: '5–7 Days' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', baseRatePerKg: 1100, dutyRatePercent: 5.0, deliveryDays: '3–5 Days' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', baseRatePerKg: 1800, dutyRatePercent: 7.0, deliveryDays: '6–9 Days' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', baseRatePerKg: 1550, dutyRatePercent: 4.5, deliveryDays: '4–6 Days' },
];

export default function CostCalculatorScreen() {
  const [selectedCountry, setSelectedCountry] = useState<CountryRate>(COUNTRIES[0]);
  const [weightKg, setWeightKg] = useState('1.5');
  const [lengthCm, setLengthCm] = useState('25');
  const [widthCm, setWidthCm] = useState('20');
  const [heightCm, setHeightCm] = useState('15');
  const [declaredValueInr, setDeclaredValueInr] = useState('3500');

  const calculation = useMemo(() => {
    const deadWeight = parseFloat(weightKg) || 0.5;
    const l = parseFloat(lengthCm) || 10;
    const w = parseFloat(widthCm) || 10;
    const h = parseFloat(heightCm) || 10;
    const val = parseFloat(declaredValueInr) || 1000;

    // Volumetric weight divisor for India Post International Air = 5000
    const volumetricWeight = (l * w * h) / 5000;
    const chargeableWeight = Math.max(deadWeight, volumetricWeight);

    const basePostalRate = chargeableWeight * selectedCountry.baseRatePerKg;
    const fuelSurcharge = basePostalRate * 0.12; // 12%
    const customsPackaging = 180;
    const estimatedCustomsDuty = (val * (selectedCountry.dutyRatePercent / 100));
    const totalCost = basePostalRate + fuelSurcharge + customsPackaging + estimatedCustomsDuty;

    return {
      deadWeight,
      volumetricWeight: volumetricWeight.toFixed(2),
      chargeableWeight: chargeableWeight.toFixed(2),
      basePostalRate: Math.round(basePostalRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      customsPackaging,
      estimatedCustomsDuty: Math.round(estimatedCustomsDuty),
      totalCost: Math.round(totalCost),
    };
  }, [selectedCountry, weightKg, lengthCm, widthCm, heightCm, declaredValueInr]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>India Post Export Cost Calculator</Text>
        <Text style={styles.bannerSub}>
          Calculate landed cost, EMS postage, customs duties, and volumetric weight for DNK international dispatches.
        </Text>
      </View>

      {/* Destination Country Pills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Destination Country</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.countryScroll}>
          {COUNTRIES.map(c => {
            const isSelected = selectedCountry.code === c.code;
            return (
              <TouchableOpacity
                key={c.code}
                style={[styles.countryPill, isSelected && styles.countryPillActive]}
                onPress={() => setSelectedCountry(c)}
                activeOpacity={0.8}
              >
                <Text style={styles.countryFlag}>{c.flag}</Text>
                <Text style={[styles.countryName, isSelected && styles.countryNameActive]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Parcel Inputs */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parcel Specifications</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Gross Weight (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={weightKg}
              onChangeText={setWeightKg}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Declared Value (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={declaredValueInr}
              onChangeText={setDeclaredValueInr}
            />
          </View>
        </View>

        <Text style={[styles.inputLabel, { marginTop: 12 }]}>Dimensions (Length × Width × Height in cm)</Text>
        <View style={styles.dimRow}>
          <TextInput style={styles.dimInput} keyboardType="decimal-pad" value={lengthCm} onChangeText={setLengthCm} placeholder="L" />
          <Text style={styles.dimX}>×</Text>
          <TextInput style={styles.dimInput} keyboardType="decimal-pad" value={widthCm} onChangeText={setWidthCm} placeholder="W" />
          <Text style={styles.dimX}>×</Text>
          <TextInput style={styles.dimInput} keyboardType="decimal-pad" value={heightCm} onChangeText={setHeightCm} placeholder="H" />
        </View>

        {/* Volumetric Insight */}
        <View style={styles.volumetricBox}>
          <Text style={styles.volumetricText}>
            ⚖️ Chargeable Weight: <Text style={{ fontWeight: 'bold' }}>{calculation.chargeableWeight} kg</Text> (Dead: {calculation.deadWeight} kg | Volumetric: {calculation.volumetricWeight} kg)
          </Text>
        </View>
      </View>

      {/* Calculation Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryTitle}>Estimated Total Landed Cost</Text>
            <Text style={styles.summarySub}>Delivery Time: {selectedCountry.deliveryDays}</Text>
          </View>
          <Text style={styles.totalPrice}>₹{calculation.totalCost.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>India Post International EMS Postage</Text>
          <Text style={styles.breakdownVal}>₹{calculation.basePostalRate.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Fuel & Security Surcharge (12%)</Text>
          <Text style={styles.breakdownVal}>₹{calculation.fuelSurcharge.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>DNK Customs Packaging & Seal</Text>
          <Text style={styles.breakdownVal}>₹{calculation.customsPackaging}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Estimated {selectedCountry.name} Customs Duty ({selectedCountry.dutyRatePercent}%)</Text>
          <Text style={styles.breakdownVal}>₹{calculation.estimatedCustomsDuty.toLocaleString('en-IN')}</Text>
        </View>
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
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  countryScroll: {
    gap: 8,
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  countryPillActive: {
    backgroundColor: '#102A43',
    borderColor: '#102A43',
  },
  countryFlag: {
    fontSize: 16,
  },
  countryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  countryNameActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dimInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  dimX: {
    color: '#94A3B8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  volumetricBox: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  volumetricText: {
    fontSize: 11,
    color: '#1E40AF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  summarySub: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
    marginTop: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C62828',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  breakdownVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
});
