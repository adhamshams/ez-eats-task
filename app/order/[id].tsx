import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, UIManager, Platform, LayoutAnimation, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import orders from '../../assets/data/orders.json';
import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

const CollapsableView = ({ children, length, title }: { children: JSX.Element, length: number, title: string }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsCollapsed(!isCollapsed);
    };

    return (
        <TouchableOpacity onPress={toggleCollapse} style={styles.statusCard}>
            <View style={styles.itemsHeader}>
                <Text style={styles.sectionTitle}>{title} ({length})</Text>
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
    const [modalVisible, setModalVisible] = useState(false);
    const [managerCode, setManagerCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t, isRTL } = useLanguage();

    // Find the order with the matching ID
    const order = orders.find(o => o.id === id) as Order | undefined;

    if (!order) {
        return (
            <View style={styles.container}>
                <Text>{t('orderNotFound')}</Text>
            </View>
        );
    }
    
    const handleRefundPress = () => {
        setModalVisible(true);
    };
    
    const handleCodeEntry = (digit: string) => {
        if (managerCode.length < 4) {
            setManagerCode(prev => prev + digit);
        }
    };
    
    const clearCode = () => {
        setManagerCode('');
    };
    
    const deleteLastDigit = () => {
        setManagerCode(prev => prev.slice(0, -1));
    };
    
    const validateCode = () => {
        setIsLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            setIsLoading(false);
            
            // For demo purposes, let's say the correct code is "1234"
            if (managerCode === "1234") {
                setModalVisible(false);
                setManagerCode('');
                Alert.alert(t('success'), t('refundApproved'));
            } else {
                Alert.alert(t('error'), t('invalidManagerCode'));
                setManagerCode('');
            }
        }, 800);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* Header */}
                <View style={[styles.header, isRTL && styles.headerRTL]}>
                    <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && styles.backButtonRTL]}>
                        <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={20} color="black" />
                        <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>{t('orderDetails')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.refundButton} onPress={handleRefundPress}>
                        <Text style={styles.refundButtonText}>{t('refund')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Client Info */}
                <View style={[styles.clientCard, isRTL && styles.clientCardRTL]}>
                    <View>
                        <Text style={[styles.clientName, isRTL && styles.textRTL]}>{order.customer.name}</Text>
                        <Text style={[styles.orderId, isRTL && styles.textRTL]}>{order.id}</Text>
                    </View>
                    <TouchableOpacity style={styles.callButton}>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Order Status */}
                <View style={styles.statusCard}>
                    <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>{t('orderDetails')}</Text>

                    <View style={[styles.statusRow, isRTL && styles.statusRowRTL]}>
                        <Ionicons name="time-outline" size={20} color="gray" />
                        <Text style={[styles.statusLabel, isRTL && styles.textRTL]}>{t('orderedAt')}</Text>
                        <Text style={[styles.statusValue, isRTL && styles.textRTL]}>{order.orderTime}</Text>
                    </View>

                    <View style={[styles.statusRow, isRTL && styles.statusRowRTL]}>
                        <Ionicons name="bag-handle-outline" size={20} color="gray" />
                        <Text style={[styles.statusLabel, isRTL && styles.textRTL]}>{t('orderType')}</Text>
                        <Text style={[styles.statusValue, isRTL && styles.textRTL]}>{t(order.type)}</Text>
                    </View>

                    <View style={[styles.statusRow, isRTL && styles.statusRowRTL]}>
                        <Ionicons name="cash-outline" size={20} color="gray" />
                        <Text style={[styles.statusLabel, isRTL && styles.textRTL]}>{t('orderPrice')}</Text>
                        <Text style={[styles.statusValue, isRTL && styles.textRTL]}>
                            {order.price}<Text style={styles.currencySuffix}> {t('currency')}</Text>
                        </Text>
                    </View>
                </View>

                {/* Item Details */}
                <CollapsableView length={order.items.length} title={t('itemDetails')}>
                    <View style={styles.itemsList}>
                        {order.items.map((item, index) => (
                            <View key={index}>
                                <View style={[styles.itemContainer, isRTL && styles.itemContainerRTL]}>
                                    <View style={styles.itemImage} />
                                    <View style={styles.itemDetails}>
                                        <View style={[styles.itemNameContainer, isRTL && styles.itemNameContainerRTL]}>
                                            <Text style={[styles.itemName, isRTL && styles.textRTL]}>{item.name} ({item.quantity})</Text>
                                            <Text style={[styles.itemPrice, isRTL && styles.textRTL]}>
                                                {item.price * item.quantity}<Text style={styles.currencySuffix}> {t('currency')}</Text>
                                            </Text>
                                        </View>
                                        {item.extras && item.extras.length > 0 ? 
                                            <Text style={[styles.extrasTitle, isRTL && styles.textRTL]}>{t('extras')}</Text>
                                            :
                                            <Text style={[styles.extrasTitle, isRTL && styles.textRTL]}>{t('noExtras')}</Text>
                                        }
                                        {item.extras && item.extras.map((extra: Extra, i: number) => (
                                            <View key={i} style={[styles.extraRow, isRTL && styles.extraRowRTL]}>
                                                <Text style={[styles.extraName, isRTL && styles.textRTL]}>{extra.name}</Text>
                                                <Text style={[styles.extraPrice, isRTL && styles.textRTL]}>
                                                    {extra.price}<Text style={styles.currencySuffix}> {t('currency')}</Text>
                                                </Text>
                                            </View>
                                        ))}
                                        {item.notes && (
                                            <Text style={[styles.itemNotes, isRTL && styles.textRTL]}>{item.notes}</Text>
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
            
            {/* Manager Code Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalHeader, isRTL && styles.modalHeaderRTL]}>
                            <Text style={[styles.modalTitle, isRTL && styles.textRTL]}>{t('managerAuthorization')}</Text>
                            <TouchableOpacity 
                                onPress={() => {
                                    setModalVisible(false);
                                    setManagerCode('');
                                }}
                            >
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.codeContainer}>
                            {[0, 1, 2, 3].map(i => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.codeDigit, 
                                        managerCode.length > i && styles.codeDigitFilled
                                    ]}
                                >
                                    {managerCode.length > i && (
                                        <Text style={styles.codeDigitText}>•</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                        
                        <View style={styles.keypadContainer}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <TouchableOpacity 
                                    key={num}
                                    style={styles.keypadButton} 
                                    onPress={() => handleCodeEntry(num.toString())}
                                >
                                    <Text style={styles.keypadButtonText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity 
                                style={styles.keypadButton} 
                                onPress={clearCode}
                            >
                                <Text style={styles.keypadButtonText}>C</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.keypadButton} 
                                onPress={() => handleCodeEntry('0')}
                            >
                                <Text style={styles.keypadButtonText}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.keypadButton} 
                                onPress={deleteLastDigit}
                            >
                                <Ionicons name="backspace-outline" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity 
                            style={[
                                styles.submitButton,
                                (managerCode.length !== 4 || isLoading) && styles.submitButtonDisabled
                            ]}
                            onPress={validateCode}
                            disabled={managerCode.length !== 4 || isLoading}
                        >
                            <Text style={styles.submitButtonText}>
                                {isLoading ? 'Verifying...' : 'Submit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        gap: 10
    },
    statusLabel: {
        flex: 1,
        fontSize: 16,
        color: 'gray'
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
        paddingVertical: 16,
        gap: 10
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    modalSubtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    codeDigit: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeDigitFilled: {
        borderColor: '#333',
        backgroundColor: '#f5f5f5',
    },
    codeDigitText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    keypadButton: {
        width: '30%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 5,
        backgroundColor: '#f5f5f5',
    },
    keypadButtonText: {
        fontSize: 24,
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 50,
        marginBottom: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    // RTL styles
    headerRTL: {
        flexDirection: 'row-reverse',
    },
    textRTL: {
        textAlign: 'right',
    },
    backButtonRTL: {
        flexDirection: 'row-reverse',
    },
    clientCardRTL: {
        flexDirection: 'row-reverse',
    },
    statusRowRTL: {
        flexDirection: 'row-reverse',
    },
    itemContainerRTL: {
        flexDirection: 'row-reverse',
    },
    itemNameContainerRTL: {
        flexDirection: 'row-reverse',
    },
    extraRowRTL: {
        flexDirection: 'row-reverse',
    },
    modalHeaderRTL: {
        flexDirection: 'row-reverse',
    }
});
