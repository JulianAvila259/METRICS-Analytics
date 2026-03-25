import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const tabs = [
  { key: 'Dashboard', label: 'Partidos' },
  { key: 'Resultados', label: 'Resultados' },
  { key: 'Perfil', label: 'Perfil' },
];

export default function BottomNav({ navigation, activeTab }) {
  const goTo = (routeName) => {
    if (routeName === activeTab) {
      return;
    }

    navigation.navigate(routeName);
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => goTo(tab.key)}
          style={styles.tabItemContainer}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabItem, activeTab === tab.key && styles.activeTab]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#161B22',
    backgroundColor: '#0A0E17',
  },
  tabItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabItem: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTab: {
    color: '#00D1FF',
    fontWeight: '700',
  },
});
