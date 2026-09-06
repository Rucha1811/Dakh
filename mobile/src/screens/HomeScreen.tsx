import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

interface HomeScreenProps {
  onNavigateTab: (tab: string) => void;
}

const PROBLEMS = [
  { icon: '📄', title: 'Complex Documentation', desc: 'Invoices, packing lists, and PBE-III paperwork simplified by Daksh AI.' },
  { icon: '🛡️', title: 'Customs Compliance', desc: 'Pre-validated HS Codes and zero-rated GST LUT export declarations.' },
  { icon: '🚚', title: 'Transparent Shipping', desc: 'Real-time landed cost calculation and India Post international EMS tracking.' },
  { icon: '🗣️', title: 'Multilingual Support', desc: 'Full conversational advisory in English, Hindi (हिन्दी), and Gujarati (ગુજરાતી).' },
];

const STEPS = [
  { num: 1, title: 'Register & KYC', desc: 'Instant onboarding with IEC code verification.' },
  { num: 2, title: 'Add Handicrafts', desc: 'Upload photos, dimensions, weight, and HS Code.' },
  { num: 3, title: 'Readiness Score', desc: 'Get automated export readiness evaluation.' },
  { num: 4, title: 'Auto-Generate PBE', desc: 'One-click Postal Bill of Export filing.' },
  { num: 5, title: 'Visit Gujarat DNK', desc: 'Packaging, weighing & customs sealing support.' },
  { num: 6, title: 'Air Dispatch', desc: 'Express air dispatch via Ahmedabad FPO & Mumbai Gateway.' },
  { num: 7, title: 'Global Delivery', desc: 'Delivered securely to international buyers in 190+ countries.' },
];

export default function HomeScreen({ onNavigateTab }: HomeScreenProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroCard}>
        <View style={styles.brandRow}>
          <View style={styles.indiaPostBadge}>
            <Text style={styles.indiaPostText}>🇮🇳 INDIA POST DNK INITIATIVE</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>SDK 54 Live</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Niryat Saathi</Text>
        <Text style={styles.heroTagline}>Empowering Indian Artisans & MSMEs for Global Cross-Border Exports</Text>
        <Text style={styles.heroDesc}>
          Direct integration with 13 Gujarat Dak Ghar Niryat Kendras (DNK), automated Postal Bill of Export (PBE-III), and multilingual AI guidance.
        </Text>

        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.primaryCta}
            onPress={() => onNavigateTab('dashboard')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryCtaText}>Enter Export Hub →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCta}
            onPress={() => onNavigateTab('assistant')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryCtaText}>🤖 Ask Daksh AI</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5-Step Cross-Border Export Corridor */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cross-Border Export Corridor</Text>
      </View>

      <View style={styles.corridorCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.corridorScroll}>
          <View style={styles.corridorNode}>
            <Text style={styles.nodeIcon}>🏪</Text>
            <Text style={styles.nodeLabel}>Artisan</Text>
            <Text style={styles.nodeSub}>Gujarat MSME</Text>
          </View>
          <Text style={styles.corridorArrow}>➔</Text>
          <View style={styles.corridorNode}>
            <Text style={styles.nodeIcon}>🏛️</Text>
            <Text style={styles.nodeLabel}>Local DNK</Text>
            <Text style={styles.nodeSub}>13 Post Offices</Text>
          </View>
          <Text style={styles.corridorArrow}>➔</Text>
          <View style={styles.corridorNode}>
            <Text style={styles.nodeIcon}>📦</Text>
            <Text style={styles.nodeLabel}>India Post</Text>
            <Text style={styles.nodeSub}>EMS Express</Text>
          </View>
          <Text style={styles.corridorArrow}>➔</Text>
          <View style={styles.corridorNode}>
            <Text style={styles.nodeIcon}>🛡️</Text>
            <Text style={styles.nodeLabel}>Customs</Text>
            <Text style={styles.nodeSub}>Ahmedabad FPO</Text>
          </View>
          <Text style={styles.corridorArrow}>➔</Text>
          <View style={styles.corridorNode}>
            <Text style={styles.nodeIcon}>🌍</Text>
            <Text style={styles.nodeLabel}>Buyer</Text>
            <Text style={styles.nodeSub}>Global Importer</Text>
          </View>
        </ScrollView>
      </View>

      {/* Quick Access Tools Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore Core Features</Text>
      </View>

      <View style={styles.toolsGrid}>
        <TouchableOpacity
          style={[styles.toolCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
          onPress={() => onNavigateTab('calculator')}
          activeOpacity={0.8}
        >
          <Text style={styles.toolIcon}>🧮</Text>
          <Text style={[styles.toolTitle, { color: '#1E40AF' }]}>Landed Cost Calculator</Text>
          <Text style={styles.toolDesc}>Estimate EMS postage, volumetric weight & duties for DE, US, UK, UAE.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
          onPress={() => onNavigateTab('dnk')}
          activeOpacity={0.8}
        >
          <Text style={styles.toolIcon}>📍</Text>
          <Text style={[styles.toolTitle, { color: '#991B1B' }]}>Gujarat DNK Locator</Text>
          <Text style={styles.toolDesc}>All 13 Gujarat centers with 1-click GPS navigation and direct dialing.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
          onPress={() => onNavigateTab('documents')}
          activeOpacity={0.8}
        >
          <Text style={styles.toolIcon}>📄</Text>
          <Text style={[styles.toolTitle, { color: '#166534' }]}>PBE & Export Docs</Text>
          <Text style={styles.toolDesc}>Compliant Postal Bill of Export, IEC verification & LUT declarations.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolCard, { backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }]}
          onPress={() => onNavigateTab('marketplace')}
          activeOpacity={0.8}
        >
          <Text style={styles.toolIcon}>🛍️</Text>
          <Text style={[styles.toolTitle, { color: '#6B21A8' }]}>Global Marketplace</Text>
          <Text style={styles.toolDesc}>Verified Indian handicrafts catalog with multi-currency INR / USD.</Text>
        </TouchableOpacity>
      </View>

      {/* Solutions / Pain Points Solved */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Overcoming Export Bottlenecks</Text>
      </View>

      <View style={styles.problemsList}>
        {PROBLEMS.map((p, idx) => (
          <View key={idx} style={styles.problemCard}>
            <Text style={styles.problemIcon}>{p.icon}</Text>
            <View style={styles.problemText}>
              <Text style={styles.problemTitle}>{p.title}</Text>
              <Text style={styles.problemDesc}>{p.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 7-Step Export Roadmap */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>7-Step Assisted Export Roadmap</Text>
      </View>

      <View style={styles.stepsCard}>
        {STEPS.map((s, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>{s.num}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}
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
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#102A43',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  indiaPostBadge: {
    backgroundColor: '#C62828',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  indiaPostText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  liveText: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  heroTagline: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 4,
    lineHeight: 18,
  },
  heroDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 16,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  primaryCta: {
    flex: 1,
    backgroundColor: '#C62828',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  secondaryCta: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334E68',
  },
  secondaryCtaText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  corridorCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  corridorScroll: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  corridorNode: {
    alignItems: 'center',
    minWidth: 70,
  },
  nodeIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  nodeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  nodeSub: {
    fontSize: 9,
    color: '#64748B',
  },
  corridorArrow: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  toolCard: {
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
    marginBottom: 4,
  },
  toolDesc: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 14,
  },
  problemsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  problemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 12,
  },
  problemIcon: {
    fontSize: 22,
  },
  problemText: {
    flex: 1,
  },
  problemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  problemDesc: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#102A43',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  stepDesc: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
});
