import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const showModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    useEffect(() => {
        showModal();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#c54949', '#c96764', '#c9615b']} style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%', gap: 20 }}>
                            <Image source={require('../../assets/images/logo.png')} style={{ width: 90, height: 90 }} />
                            <Text style={{ fontSize: 16, fontFamily: 'SFProDisplay', color: '#fff', textAlign: 'center' }}>Login to get started with a seamless restaurant management experience</Text>
                        </View>
                        <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['70%']} enableDynamicSizing={false} enablePanDownToClose={false} backgroundStyle={{ backgroundColor: '#fff' }} handleIndicatorStyle={{ display: 'none' }} keyboardBehavior="interactive" keyboardBlurBehavior="restore" >
                            <BottomSheetView style={styles.contentContainer}>
                                <Text>Hello</Text>
                            </BottomSheetView>
                        </BottomSheetModal>
                    </SafeAreaView>
                    <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['70%']} enableDynamicSizing={false} enablePanDownToClose={false} backgroundStyle={{ backgroundColor: '#fff' }} handleIndicatorStyle={{ display: 'none' }} keyboardBehavior="interactive" keyboardBlurBehavior="restore" >
                        <BottomSheetView style={styles.contentContainer}>
                            <Stack>
                                <Stack.Screen name="index" options={{ headerShown: false }} />
                                <Stack.Screen name="verify" options={{ headerShown: false }} />
                            </Stack>
                        </BottomSheetView>
                    </BottomSheetModal>
                </LinearGradient>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
    }
}); 