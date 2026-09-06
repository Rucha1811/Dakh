import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { USERS, UserProfile } from './src/data/mobileData';
import Header from './src/components/Header';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import SellerDashboardScreen from './src/screens/SellerDashboardScreen';
import BuyerDashboardScreen from './src/screens/BuyerDashboardScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import OperatorDashboardScreen from './src/screens/OperatorDashboardScreen';

import AIAssistantScreen from './src/screens/AIAssistantScreen';
import GujaratDNKScreen from './src/screens/GujaratDNKScreen';
import CostCalculatorScreen from './src/screens/CostCalculatorScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import ShipmentsScreen from './src/screens/ShipmentsScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminComplianceScreen from './src/screens/AdminComplianceScreen';
import AdminSellersScreen from './src/screens/AdminSellersScreen';

type Tab =
  | 'home'
  | 'dashboard'
  | 'assistant'
  | 'dnk'
  | 'calculator'
  | 'documents'
  | 'shipments'
  | 'marketplace'
  | 'compliance'
  | 'sellers'
  | 'settings'
  | 'profile';

function MainApp() {
  const insets = useSafeAreaInsets();
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS[0]); // default Meera Patel (Seller)
  const [currentTab, setCurrentTab] = useState<Tab>('home');

  // Dynamically compute bottom navigation tabs based on user role (Home and Settings included for all)
  const getTabsForRole = (): { id: Tab; label: string; icon: string }[] => {
    switch (currentUser.role) {
      case 'buyer':
        return [
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'dashboard', label: 'Buyer Hub', icon: '🛍️' },
          { id: 'marketplace', label: 'Crafts', icon: '✨' },
          { id: 'shipments', label: 'Tracking', icon: '✈️' },
          { id: 'calculator', label: 'Duties', icon: '🧮' },
          { id: 'assistant', label: 'Daksh AI', icon: '🤖' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
          { id: 'profile', label: 'Persona', icon: '👤' },
        ];
      case 'admin':
        return [
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'dashboard', label: 'Telemetry', icon: '📊' },
          { id: 'compliance', label: 'Compliance', icon: '📋' },
          { id: 'sellers', label: 'Artisans', icon: '👥' },
          { id: 'dnk', label: 'Gujarat DNK', icon: '📍' },
          { id: 'shipments', label: 'FPO Gate', icon: '✈️' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
          { id: 'profile', label: 'Persona', icon: '👤' },
        ];
      case 'operator':
        return [
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'dashboard', label: 'Counter', icon: '🏬' },
          { id: 'documents', label: 'PBE Filing', icon: '📄' },
          { id: 'calculator', label: 'Weigh & Rate', icon: '⚖️' },
          { id: 'shipments', label: 'Manifest', icon: '📦' },
          { id: 'dnk', label: 'Hub Info', icon: '📍' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
          { id: 'profile', label: 'Persona', icon: '👤' },
        ];
      case 'seller':
      default:
        return [
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'dashboard', label: 'Export Hub', icon: '📦' },
          { id: 'assistant', label: 'Daksh AI', icon: '🤖' },
          { id: 'dnk', label: 'Gujarat DNK', icon: '📍' },
          { id: 'calculator', label: 'Calculator', icon: '🧮' },
          { id: 'documents', label: 'Docs', icon: '📄' },
          { id: 'shipments', label: 'Tracking', icon: '✈️' },
          { id: 'marketplace', label: 'Market', icon: '🛍️' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
          { id: 'profile', label: 'Persona', icon: '👤' },
        ];
    }
  };

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'home': return 'Niryat Saathi Overview';
      case 'dashboard':
        if (currentUser.role === 'buyer') return `${currentUser.name}'s Global Purchases`;
        if (currentUser.role === 'admin') return 'National Export Telemetry';
        if (currentUser.role === 'operator') return 'Ahmedabad GPO DNK Counter';
        return `${currentUser.name}'s Export Portal`;
      case 'assistant': return 'Daksh AI Export Assistant';
      case 'dnk': return 'Gujarat DNK Post Offices';
      case 'calculator': return 'Export Cost & Duty Calculator';
      case 'documents': return 'Export Documents & PBE';
      case 'shipments': return 'International Parcel Tracking';
      case 'marketplace': return 'Global Buyer Marketplace';
      case 'compliance': return 'Customs & KYC Approvals';
      case 'sellers': return 'Registered MSME Artisans';
      case 'settings': return 'Account & App Settings';
      case 'profile': return 'User Persona & Role Switcher';
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentTab) {
      case 'home': return 'India Post Cross-Border Export Enablement';
      case 'dashboard':
        if (currentUser.role === 'buyer') return 'Track International Deliveries & Artisans';
        if (currentUser.role === 'admin') return 'Department of Posts & CBIC Monitoring';
        if (currentUser.role === 'operator') return 'Assisted Export Intake & Customs Packaging';
        return 'Dak Ghar Niryat Kendra Enablement';
      case 'assistant': return 'Multilingual Groq LLM Assistant (EN, HI, GU)';
      case 'dnk': return '13 Gujarat Post Office Export Centers';
      case 'calculator': return 'India Post EMS Rates & Landed Duties';
      case 'documents': return 'PBE-III, IEC, LUT & Customs Pipeline';
      case 'shipments': return 'Live Ahmedabad FPO & Mumbai Gateway Tracking';
      case 'marketplace': return 'Verified Indian Handicrafts & MSME';
      case 'compliance': return 'Review IEC, GST LUT & PBE-III Filings';
      case 'sellers': return '428 Enabled Gujarat Craft Enterprises';
      case 'settings': return 'Language, Theme, Server Telemetry & Preferences';
      case 'profile': return '1-Click Persona Switch (Seller, Buyer, Admin, Operator)';
    }
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen onNavigateTab={(t) => setCurrentTab(t as Tab)} />;
      case 'dashboard':
        if (currentUser.role === 'buyer') return <BuyerDashboardScreen onNavigateTab={(t) => setCurrentTab(t as Tab)} />;
        if (currentUser.role === 'admin') return <AdminDashboardScreen onNavigateTab={(t) => setCurrentTab(t as Tab)} />;
        if (currentUser.role === 'operator') return <OperatorDashboardScreen onNavigateTab={(t) => setCurrentTab(t as Tab)} />;
        return <SellerDashboardScreen onNavigateTab={(t) => setCurrentTab(t as Tab)} />;
      case 'assistant':
        return <AIAssistantScreen />;
      case 'dnk':
        return <GujaratDNKScreen />;
      case 'calculator':
        return <CostCalculatorScreen />;
      case 'documents':
        return <DocumentsScreen />;
      case 'shipments':
        return <ShipmentsScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'compliance':
        return <AdminComplianceScreen />;
      case 'sellers':
        return <AdminSellersScreen />;
      case 'settings':
        return (
          <SettingsScreen
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            onSwitchUserPrompt={() => setCurrentTab('profile')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            onSwitchUser={(u) => {
              setCurrentUser(u);
              setCurrentTab('dashboard');
            }}
          />
        );
    }
  };

  const activeTabs = getTabsForRole();

  return (
    <View style={styles.appContainer}>
      <StatusBar style="light" backgroundColor="#102A43" translucent />
      <Header
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        user={currentUser}
        onHomePress={() => setCurrentTab('home')}
        onSettingsPress={() => setCurrentTab('settings')}
        onProfilePress={() => setCurrentTab('profile')}
      />

      <View style={styles.body}>
        {renderScreen()}
      </View>

      {/* Motorola Edge 70 Floating Dock Navigation */}
      <View style={[styles.bottomNavContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <View style={styles.bottomNavDock}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navScroll}
          >
            {activeTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setCurrentTab(tab.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#102A43',
  },
  body: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomNavContainer: {
    backgroundColor: '#102A43',
    paddingTop: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E3A5F',
  },
  bottomNavDock: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  navScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    gap: 4,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    minWidth: 50,
  },
  tabBtnActive: {
    backgroundColor: '#1E3A5F',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 8.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
