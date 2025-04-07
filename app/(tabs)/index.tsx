import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { TabView, TabBar, NavigationState, SceneRendererProps } from "react-native-tab-view";
import { useState, useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import orders from '../../assets/data/orders.json';
import { router } from 'expo-router';
import { useLanguage } from '../../contexts/languageContext';

interface Extra {
  name: string;
  price: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  extras?: Extra[];
  notes?: string;
}

interface Customer {
    name: string;
    phone: string;
    email: string;
    address?: string;
}

interface Order {
  id: string;
  status: string;
  type: 'pickup' | 'delivery' | 'dine-in';
  price: number;
  items: OrderItem[];
  customer: Customer;
  orderTime: string;
  table?: string;
}

interface Route {
  key: string;
  title: string;
}

export default function HomeScreen() {
  const { t, isRTL } = useLanguage();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    setRoutes([
      { key: 'home', title: t('home') },
      { key: 'ready', title: t('ready') },
    ]);
  }, [isRTL]);

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
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <View style={[styles.logoContainer, isRTL && styles.logoContainerRTL]}>
          <View style={styles.logo}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>EZ</Text>
          </View>
          <View style={styles.restaurantInfo}>
            <Text style={[styles.restaurantName, isRTL && styles.textRTL]}>{t('restaurantName')}</Text>
            <Text style={[styles.restaurantHours, isRTL && styles.textRTL]}>{t('restaurantHours')}</Text>
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
  const { t, isRTL } = useLanguage();
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
        return t('pickup');
      case 'delivery':
        return t('delivery');
      case 'dine-in':
        return order.table || t('table');
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/order/${order.id}`)}>
      <View style={[styles.cardHeader, isRTL && styles.cardHeaderRTL]}>
        <Text style={[styles.waiterName, isRTL && styles.textRTL]}>{t('waiterName')}</Text>
        <Text style={[styles.orderId, isRTL && styles.textRTL]}>{order.id}</Text>
      </View>
      <View style={[styles.cardTimeRow, isRTL && styles.cardTimeRowRTL]}>
        <View style={[styles.timeContainer, isRTL && styles.timeContainerRTL]}>
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text style={[styles.timeText, isRTL && styles.textRTL]}>{order.orderTime}</Text>
        </View>
        <View style={[styles.typeContainer, isRTL && styles.typeContainerRTL]}>
          {getIcon(order.type)}
          <Text style={[styles.typeText, isRTL && styles.textRTL]}>{getTypeLabel(order.type, order)}</Text>
        </View>
      </View>
      
      <View style={[styles.cardActions, isRTL && styles.cardActionsRTL]}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            order.status === 'completed' ? styles.actionButtonDisabled : styles.sendSmsButton
          ]}
          disabled={order.status === 'completed'}
        >
          <Ionicons name="chatbubble-outline" size={16} color={order.status === 'completed' ? "gray" : "white"} />
          <Text style={[styles.buttonText, { color: order.status === 'completed' ? "gray" : "white" }, isRTL && styles.textRTL]}>{t('sendSMS')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            order.status === 'completed' ? styles.pickedUpButton : styles.actionButtonDisabled
          ]}
        >
          <Ionicons name="checkmark-circle-outline" size={16} color={order.status === 'completed' ? "white" : "gray"} />
          <Text style={[styles.buttonText, { color: order.status === 'completed' ? "white" : "gray" }, isRTL && styles.textRTL]}>{t('pickedUp')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F3F3F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center'
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
    fontFamily: 'SFProDisplay',
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
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  waiterName: {
    fontSize: 15,
    fontFamily: 'SFProDisplay'
  },
  orderId: {
    fontSize: 15,
    fontFamily: 'SFProDisplay'
  },
  cardTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  timeText: {
    fontSize: 15,
    fontFamily: 'SFProDisplay',
    color: 'gray',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  typeText: {
    fontSize: 15,
    fontFamily: 'SFProDisplay',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 100,
    flex: 1,
    gap: 5
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
    fontSize: 15,
    fontFamily: 'SFProDisplay',
    color: 'white',
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  textRTL: {
    textAlign: 'right',
  },
  cardHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  cardTimeRowRTL: {
    flexDirection: 'row-reverse',
  },
  timeContainerRTL: {
    flexDirection: 'row-reverse',
  },
  typeContainerRTL: {
    flexDirection: 'row-reverse',
  },
  cardActionsRTL: {
    flexDirection: 'row-reverse',
  },
  logoContainerRTL: {
    flexDirection: 'row-reverse',
  }
});
