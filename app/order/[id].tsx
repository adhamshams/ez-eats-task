import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, UIManager, Platform, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import orders from '../../assets/data/orders.json';
import { useState } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define types
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

const CollapsableView = ({ children, length }: { children: JSX.Element, length: number }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsCollapsed(!isCollapsed);
    };

    return (
        <TouchableOpacity onPress={toggleCollapse} style={styles.statusCard}>
            <View style={styles.itemsHeader}>
                <Text style={styles.sectionTitle}>Item Details ({length})</Text>
                <Ionicons name={isCollapsed ? "chevron-down" : "chevron-up"} size={24} color="black" />
            </View>
            {!isCollapsed &&
                children
            }
        </TouchableOpacity>
    );
};

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();

    // Find the order with the matching ID
    const order = orders.find(o => o.id === id) as Order | undefined;

    if (!order) {
        return (
            <View style={styles.container}>
                <Text>Order not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={20} color="black" />
                        <Text style={styles.headerTitle}>Order Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.refundButton}>
                        <Text style={styles.refundButtonText}>Refund</Text>
                    </TouchableOpacity>
                </View>

                {/* Client Info */}
                <View style={styles.clientCard}>
                    <View>
                        <Text style={styles.clientName}>{order.customer.name}</Text>
                        <Text style={styles.orderId}>{order.id}</Text>
                    </View>
                    <TouchableOpacity style={styles.callButton}>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Order Status */}
                <View style={styles.statusCard}>
                    <Text style={styles.sectionTitle}>Order Status</Text>

                    <View style={styles.statusRow}>
                        <Ionicons name="time-outline" size={20} color="gray" />
                        <Text style={styles.statusLabel}>Ordered At</Text>
                        <Text style={styles.statusValue}>{order.orderTime}</Text>
                    </View>

                    <View style={styles.statusRow}>
                        <Ionicons name="bag-handle-outline" size={20} color="gray" />
                        <Text style={styles.statusLabel}>Order Type</Text>
                        <Text style={styles.statusValue}>{order.type.charAt(0).toUpperCase() + order.type.slice(1)}</Text>
                    </View>

                    <View style={styles.statusRow}>
                        <Ionicons name="cash-outline" size={20} color="gray" />
                        <Text style={styles.statusLabel}>Order Price</Text>
                        <Text style={styles.statusValue}>{order.price}<Text style={styles.currencySuffix}> EGP</Text></Text>
                    </View>
                </View>

                {/* Item Details */}
                <CollapsableView length={order.items.length}>
                    <View style={styles.itemsList}>
                        {order.items.map((item, index) => (
                            <View key={index}>
                                <View style={styles.itemContainer}>
                                    <View style={styles.itemImage} />
                                    <View style={styles.itemDetails}>
                                        <View style={styles.itemNameContainer}>
                                            <Text style={styles.itemName}>{item.name} ({item.quantity})</Text>
                                            <Text style={styles.itemPrice}>{item.price * item.quantity}<Text style={styles.currencySuffix}> EGP</Text></Text>
                                        </View>
                                        {item.extras && item.extras.length > 0 ? 
                                            <Text style={styles.extrasTitle}>Extras:</Text>
                                            :
                                            <Text style={styles.extrasTitle}>No Extras</Text>
                                        }
                                        {item.extras && item.extras.map((extra: Extra, i: number) => (
                                            <View key={i} style={styles.extraRow}>
                                                <Text style={styles.extraName}>{extra.name}</Text>
                                                <Text style={styles.extraPrice}>{extra.price}<Text style={styles.currencySuffix}> EGP</Text></Text>
                                            </View>
                                        ))}
                                        {item.notes && (
                                            <Text style={styles.itemNotes}>{item.notes}</Text>
                                        )}
                                    </View>
                                </View>
                                {index < order.items.length - 1 && (
                                    <View style={styles.divider} />
                                )}
                            </View>
                        ))}
                    </View>
                </CollapsableView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 8,
    },
    refundButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 7,
        paddingHorizontal: 24,
        borderRadius: 50,
    },
    refundButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    clientCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    clientName: {
        fontSize: 20,
        fontWeight: '600',
    },
    orderId: {
        fontSize: 16,
        color: 'gray',
        marginTop: 4,
    },
    callButton: {
        backgroundColor: '#333',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusCard: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'SFProDisplay'
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    statusLabel: {
        flex: 1,
        fontSize: 16,
        color: 'gray',
        marginLeft: 10,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemsHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemsList: {
        marginTop: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 16
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#f0f0f0',
    },
    itemDetails: {
        flex: 1,
        alignSelf: 'center'
    },
    itemNameContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'SFProDisplay',
        maxWidth: '70%'
    },
    extrasTitle: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
    },
    extraRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    extraName: {
        fontSize: 14,
        color: 'gray',
    },
    extraPrice: {
        fontSize: 14,
        color: 'gray'
    },
    currencySuffix: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'SFProDisplay'
    },
    itemNotes: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
        fontStyle: 'italic',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '600'
    },
    divider: {
        height: 2,
        backgroundColor: '#f0f0f0',
        width: '100%',
        marginVertical: 16
    }
});
