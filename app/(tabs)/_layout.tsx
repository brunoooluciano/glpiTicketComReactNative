import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Criar um Chamado',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle-sharp' : 'add-circle-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="consulta"
        options={{
          title: 'Consultar um Chamado',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search-circle-sharp' : 'search-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#000000',
    headerStyle: {
      backgroundColor: '#000000',
    },
    headerShadowVisible: false,
    headerTintColor: '#000',
    tabBarStyle: {
    backgroundColor: '#0000',
    },
  }}
></Tabs>