import React from 'react';
import { Tabs, Link } from 'expo-router';
import { StyleSheet, Pressable, Text } from 'react-native';

const palette = {
  background: '#05080f',
  surface: '#0e1523',
  card: '#121c2f',
  accent: '#7ef0ff',
  accentWarm: '#ff7ab3',
  text: '#e6edf7',
  muted: '#9db0c8',
  border: '#1c2638',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTintColor: palette.accent,
        headerTitleStyle: styles.headerTitle,
        headerRight: () => (
          <Link href="/(tabs)/insights" asChild>
            <Pressable style={styles.chatButton}>
              <Text style={styles.chatButtonText}>🤖</Text>
            </Pressable>
          </Link>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerTitle: 'VelaMind',
          tabBarIcon: ({ color }) => <TabIcon icon="🏡" color={color} />,
        }}
      />

      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check In',
          tabBarLabel: 'Check In',
          headerTitle: 'Daily Check-in',
          tabBarIcon: ({ color }) => <TabIcon icon="🧭" color={color} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          headerTitle: 'Mood History',
          tabBarIcon: ({ color }) => <TabIcon icon="🗺️" color={color} />,
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarLabel: 'Chatbot',
          headerTitle: 'Atlas Chat',
          tabBarIcon: ({ color }) => <TabIcon icon="🛰️" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color }: { icon: string; color: string }) {
  return <Text style={{ color, fontSize: 18 }}>{icon}</Text>;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: palette.surface,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    height: 62,
    elevation: 12,
  },
  header: {
    backgroundColor: palette.background,
    borderBottomColor: palette.border,
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
  },
  chatButton: {
    backgroundColor: palette.accentWarm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chatButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
