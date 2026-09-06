import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { EXPORT_DOCUMENTS, ExportDocument } from '../data/mobileData';

export default function DocumentsScreen() {
  const [docs, setDocs] = useState<ExportDocument[]>(EXPORT_DOCUMENTS);

  const handleAction = (doc: ExportDocument) => {
    Alert.alert(
      doc.title,
      `Type: ${doc.type}\nStatus: ${doc.status}\nIssued By: ${doc.issuedBy}\nValidity: ${doc.validity}\n\n${doc.description}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: doc.status === 'Ready' ? 'View / Download PDF' : 'Generate / Apply',
          onPress: () => {
            if (doc.status === 'Ready') {
              Alert.alert('PDF Ready', `Official ${doc.title} preview loaded successfully.`);
            } else {
              setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'Ready' } : d));
              Alert.alert('Document Generated', `${doc.title} has been generated and validated for your export.`);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Export Documentation Center</Text>
        <Text style={styles.bannerSub}>
          India Post DNK compliant documentation pipeline for customs clearance and DGFT trade facilitation.
        </Text>
      </View>

      {/* Docs List */}
      <View style={styles.list}>
        {docs.map(doc => {
          const isReady = doc.status === 'Ready';
          return (
            <View key={doc.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleArea}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <Text style={styles.docType}>{doc.type} • {doc.issuedBy}</Text>
                </View>
                <View style={[styles.badge, isReady ? styles.readyBadge : styles.pendingBadge]}>
                  <Text style={[styles.badgeText, isReady ? styles.readyText : styles.pendingText]}>
                    {doc.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.docDesc}>{doc.description}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Validity: <Text style={styles.metaBold}>{doc.validity}</Text></Text>
                {doc.mandatory && (
                  <View style={styles.mandatoryBadge}>
                    <Text style={styles.mandatoryText}>MANDATORY</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.actionBtn, isReady ? styles.actionBtnReady : styles.actionBtnPending]}
                onPress={() => handleAction(doc)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionBtnText, isReady ? styles.actionTextReady : styles.actionTextPending]}>
                  {isReady ? '📄 View Official PDF' : '⚡ Generate Document'}
                </Text>
              </TouchableOpacity>
            </View>
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
  },
  list: {
    padding: 16,
    gap: 12,
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
  titleArea: {
    flex: 1,
    marginRight: 8,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  docType: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  readyBadge: {
    backgroundColor: '#DCFCE7',
  },
  pendingBadge: {
    backgroundColor: '#FEF9C3',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  readyText: {
    color: '#16A34A',
  },
  pendingText: {
    color: '#CA8A04',
  },
  docDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  metaBold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  mandatoryBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mandatoryText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#C62828',
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnReady: {
    backgroundColor: '#102A43',
  },
  actionBtnPending: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionTextReady: {
    color: '#FFFFFF',
  },
  actionTextPending: {
    color: '#C62828',
  },
});
