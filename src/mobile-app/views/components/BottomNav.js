import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabs = [
  { label: 'Partidos', route: 'Dashboard' },
  { label: 'Resultados', route: 'Resultados' },
  { label: 'Perfil', route: 'Perfil' },
];

export default function BottomNav({ activeRoute, navigation }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeRoute === tab.route;

        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tabItemContainer}
            onPress={() => {
              if (!isActive) {
                navigation.navigate(tab.route);
              }
            }}
          >
            <Text style={[styles.tabItem, isActive && styles.activeTab]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#161B22',
    backgroundColor: '#0A0E17',
  },
  tabItemContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabItem: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTab: {
    color: '#00D1FF',
  },
});
