import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { TabView, TabBar, NavigationState, SceneRendererProps } from "react-native-tab-view";
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import orders from '../../assets/data/orders.json';
import { router } from 'expo-router';

// Define types
interface Order {
  id: string;
  status: string;
  type: 'pickup' | 'delivery' | 'dine-in';
  price: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  customer: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
  orderTime: string;
  table?: string;
}

interface Route {
  key: string;
  title: string;
}

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'home', title: 'Home' },
    { key: 'ready', title: 'Ready' },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'home':
        return <OrdersList orders={orders as Order[]} />;
      case 'ready':
        return <OrdersList orders={(orders as Order[]).filter(order => order.status === 'ready')} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>EZ</Text>
          </View>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>Restaurant Name</Text>
            <Text style={styles.restaurantHours}>8:00 - 16:00</Text>
          </View>
        </View>
        <View style={styles.brandLogo}>
          <Text style={styles.brandText}>EZ<Text style={{ fontWeight: 'normal' }}>EATS</Text></Text>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props: SceneRendererProps & { navigationState: NavigationState<Route> }) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#000' }}
            style={{ backgroundColor: 'white' }}
            activeColor='#000'
            inactiveColor="#ccc"
          />
        )}
      />
    </SafeAreaView>
  );
}

function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <FlatList
      style={styles.container}
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <OrderCard order={item} />
      )}
    />
  );
}

function OrderCard({ order }: { order: Order }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <Ionicons name="bag-handle-outline" size={16} color="black" />;
      case 'delivery':
        return <MaterialIcons name="delivery-dining" size={16} color="black" />;
      case 'dine-in':
        return <MaterialIcons name="restaurant" size={16} color="black" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string, order: Order) => {
    switch (type) {
      case 'pickup':
        return 'Pickup';
      case 'delivery':
        return 'Delivery';
      case 'dine-in':
        return order.table || 'Table';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/order/${order.id}`)}>
      <View style={styles.cardHeader}>
        <Text style={styles.waiterName}>Waiter Name</Text>
        <Text style={styles.orderId}>{order.id}</Text>
      </View>
      <View style={styles.cardTimeRow}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text style={styles.timeText}>{order.orderTime}</Text>
        </View>
        <View style={styles.typeContainer}>
          {getIcon(order.type)}
          <Text style={styles.typeText}>{getTypeLabel(order.type, order)}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            order.status === 'completed' ? styles.actionButtonDisabled : styles.sendSmsButton
          ]}
          disabled={order.status === 'completed'}
        >
          <Ionicons name="chatbubble-outline" size={16} color={order.status === 'completed' ? "gray" : "white"} />
          <Text style={[styles.buttonText, { color: order.status === 'completed' ? "gray" : "white" }]}>Send SMS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            order.status === 'completed' ? styles.pickedUpButton : styles.actionButtonDisabled
          ]}
        >
          <Ionicons name="checkmark-circle-outline" size={16} color={order.status === 'completed' ? "white" : "gray"} />
          <Text style={[styles.buttonText, { color: order.status === 'completed' ? "white" : "gray" }]}>Picked Up</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  restaurantInfo: {
    flexDirection: 'column',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantHours: {
    fontSize: 12,
    color: 'gray',
  },
  brandLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  waiterName: {
    fontSize: 16,
    fontWeight: '500',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 14,
    color: 'gray',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  sendSmsButton: {
    backgroundColor: '#283593',
  },
  pickedUpButton: {
    backgroundColor: '#283593',
  },
  actionButtonDisabled: {
    backgroundColor: '#f1f1f1',
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 14,
    color: 'white',
  },
});
