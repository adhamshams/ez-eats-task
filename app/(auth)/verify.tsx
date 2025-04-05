import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, Keyboard, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useSession } from '@/contexts/ctx';
import { CodeField, Cursor, useClearByFocusCell } from 'react-native-confirmation-code-field';

const { width, height } = Dimensions.get('window');

export default function VerifyScreen() {

    const { phoneNumber } = useLocalSearchParams();

    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [timer, setTimer] = useState(30);

    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const { signIn } = useSession();

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            signIn();
            Keyboard.dismiss();
            router.replace('/(tabs)');
        }, 1000);
    };

    const resendSMS = async () => {
        if (timer === 0) {
            setTimer(30);
        }
    }

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [timer]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                <AntDesign name="left" size={20} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontFamily: 'SFProDisplay', marginTop: 10, marginHorizontal: 15 }}>We have sent a 4 digit code to your phone number {phoneNumber}</Text>
            <CodeField
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={4}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete='sms-otp'
                renderCell={({ index, symbol, isFocused }) => (
                    <View
                        onLayout={getCellOnLayoutHandler(index)}
                        key={index}
                        style={[styles.cellRoot, isFocused && styles.focusCell]}>
                        <Text style={styles.cellText}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    </View>
                )}
            />
            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive code?</Text>
                <TouchableOpacity onPress={() => resendSMS()}>
                    <Text style={[styles.resendButtonText, timer > 0 && styles.resendButtonTextDisabled]}>
                        {' '}{timer > 0 ? timer + 's' : 'Resend'}
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={handleSubmit}
                style={{
                    backgroundColor: value.length === 4 ? '#EA374A' : '#EA374A80',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100,
                    marginTop: 'auto',
                    marginBottom: 15,
                    width: width - 30,
                    alignSelf: 'center'
                }}
                disabled={value.length !== 4}
            >
                {loading ? <ActivityIndicator size={'small'} color={'#fff'} /> : <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'SFProDisplay', textAlign: 'center' }}>Confirm OTP</Text>}
            </TouchableOpacity>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    codeFieldRoot: {
        marginTop: 15,
        width: width - 30,
        alignSelf: 'center'
    },
    cellRoot: {
        width: 70,
        height: 70,
        backgroundColor: '#F3F3F3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    cellText: {
        color: '#000',
        fontSize: 35,
        textAlign: 'center',
        fontFamily: 'SFProDisplay'
    },
    focusCell: {
        borderWidth: 1,
        borderColor: '#EA374A',
        backgroundColor: '#EA374A1A'
    },
    resendContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 15
    },
    resendText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'SFProDisplay'
    },
    resendButtonText: {
        color: '#EA374A',
        fontSize: 16,
        textDecorationLine: 'underline',
        fontFamily: 'SFProDisplay'
    },
    resendButtonTextDisabled: {
        color: 'grey'
    }
});