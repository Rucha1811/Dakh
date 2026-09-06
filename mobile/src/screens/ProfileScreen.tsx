import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { USERS, UserProfile } from '../data/mobileData';

interface ProfileScreenProps {
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
}

export default function ProfileScreen({ currentUser, onSwitchUser }: ProfileScreenProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'seller': return '#C62828';
      case 'operator': return '#C77C02';
      case 'admin': return '#2563EB';
      case 'buyer': return '#0D9488';
      default: return '#102A43';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current User Profile Card */}
      <View style={styles.profileCard}>
        <View style={[styles.avatarLarge, { backgroundColor: getRoleColor(currentUser.role) }]}>
          <Text style={styles.avatarLargeText}>
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>

        <Text style={styles.profileName}>{currentUser.name}</Text>
        <Text style={styles.profileEmail}>{currentUser.email}</Text>

        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(currentUser.role) }]}>
          <Text style={styles.roleBadgeText}>{currentUser.role.toUpperCase()} PORTAL</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoVal}>{currentUser.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoVal}>{currentUser.location}</Text>
        </View>
      </View>

      {/* 1-Click Role Switcher Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Switch Demo Persona (1-Click Switch)</Text>
        <Text style={styles.sectionSubtitle}>
          Select a role to test Niryat Saathi from different user perspectives:
        </Text>

        <View style={styles.userList}>
          {USERS.map(u => {
            const isCurrent = u.id === currentUser.id;
            return (
              <TouchableOpacity
                key={u.id}
                style={[styles.userOption, isCurrent && styles.userOptionActive]}
                onPress={() => {
                  onSwitchUser(u);
                  Alert.alert('Persona Switched', `Logged in as ${u.name} (${u.role.toUpperCase()})`);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.userAvatarSmall, { backgroundColor: getRoleColor(u.role) }]}>
                  <Text style={styles.avatarSmallText}>
                    {u.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>

                <View style={styles.userOptionContent}>
                  <Text style={styles.userOptionName}>{u.name}</Text>
                  <Text style={styles.userOptionRole}>
                    Role: <Text style={{ fontWeight: 'bold', color: getRoleColor(u.role) }}>{u.role.toUpperCase()}</Text> • {u.location}
                  </Text>
                </View>

                {isCurrent && (
                  <View style={styles.activeCheck}>
                    <Text style={styles.activeCheckText}>✓ Active</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* App Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>📱 Niryat Saathi Mobile App</Text>
        <Text style={styles.infoBoxText}>
          Platform: Expo SDK 54 / React Native 0.76.7{'\n'}
          Backend: Django REST API + MongoDB + Groq AI{'\n'}
          Dak Ghar Niryat Kendra (DNK) & India Post Digital Export Enablement
        </Text>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarLargeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 14,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  userList: {
    gap: 8,
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userOptionActive: {
    borderColor: '#C62828',
    backgroundColor: '#FFFBFB',
    borderWidth: 2,
  },
  userAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userOptionContent: {
    flex: 1,
    marginLeft: 10,
  },
  userOptionName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  userOptionRole: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  activeCheck: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeCheckText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  infoBox: {
    margin: 16,
    backgroundColor: '#EEF2F6',
    padding: 14,
    borderRadius: 14,
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#102A43',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
});
