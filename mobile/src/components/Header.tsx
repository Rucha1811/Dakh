import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserProfile } from '../data/mobileData';

interface HeaderProps {
  title: string;
  subtitle?: string;
  user: UserProfile;
  onHomePress: () => void;
  onSettingsPress: () => void;
  onProfilePress: () => void;
}

export default function Header({
  title,
  subtitle,
  user,
  onHomePress,
  onSettingsPress,
  onProfilePress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

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
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 14) + 6, paddingHorizontal: Math.max(insets.left, 18) }]}>
      <View style={styles.left}>
        <TouchableOpacity
          style={styles.brandBadge}
          onPress={onHomePress}
          activeOpacity={0.7}
        >
          <Text style={styles.brandText}>NS</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onHomePress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>⚙️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.userBadge, { borderColor: getRoleColor(user.role) }]}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={[styles.avatar, { backgroundColor: getRoleColor(user.role) }]}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    backgroundColor: '#102A43',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 6,
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  brandText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334E68',
  },
  actionIcon: {
    fontSize: 14,
  },
  userBadge: {
    borderRadius: 16,
    borderWidth: 1.5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
