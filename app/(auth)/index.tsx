import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Modal, Keyboard, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Feather, Entypo, AntDesign } from '@expo/vector-icons';
import { CountryList } from "react-native-country-codes-picker";

const { width, height } = Dimensions.get('window');

export default function PhoneNumberScreen() {

  const [countryCode, setCountryCode] = useState('+20');
  const [countryFlag, setCountryFlag] = useState('🇪🇬');
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Keyboard.dismiss();
      router.push({
        pathname: '/verify',
        params: { phoneNumber: countryCode + phoneNumber }
      });
      Keyboard.dismiss();
    }, 1000);
  };


  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
          <Feather name="phone" size={16} color="black" />
          <Text style={{ fontSize: 16, fontFamily: 'SFProDisplay', marginLeft: 10 }}>Phone Number</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: width - 30, height: 50, backgroundColor: '#F3F3F3', borderRadius: 10, paddingLeft: 10, marginTop: 10, alignSelf: 'center' }}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>{countryFlag}</Text>
            <Text style={{ fontSize: 16, color: '#000', fontFamily: 'SFProDisplay', marginLeft: 5 }}>{countryCode}</Text>
            <Entypo name="chevron-down" style={{ marginRight: 10, marginLeft: 5 }} size={15} color="#000" />
          </TouchableOpacity>
          <BottomSheetTextInput
            placeholderTextColor="rgba(0,0,0,0.3)"
            placeholder="Ex: 1158388431"
            style={{
              height: 50,
              fontSize: 16,
              color: '#191919',
              fontFamily: 'SFProDisplay',
              flex: 1
            }}
            maxLength={15}
            autoComplete="tel-country-code"
            keyboardType="numeric"
            selectionColor={'#000'}
            onChangeText={(text) => setPhoneNumber(text)}
            defaultValue={phoneNumber}
          />
        </View>
        <TouchableOpacity
          onPress={() => phoneNumber.length > 0 ? handleSubmit() : null}
          style={{
            backgroundColor: phoneNumber.length > 0 ? '#EA374A' : '#EA374A80',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            marginTop: 'auto',
            marginBottom: 15,
            width: width - 30,
            alignSelf: 'center'
          }}
        >
          {loading ? <ActivityIndicator size={'small'} color={'#fff'} /> : <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'SFProDisplay', textAlign: 'center' }}>Continue</Text>}
        </TouchableOpacity>
      </SafeAreaView>
      <Modal animationType="slide" transparent={false} visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <SafeAreaView style={styles.modalView}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginLeft: 'auto', marginRight: 15, paddingVertical: 10 }}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <CountryList
            lang={'en'}
            style={{
              countryButtonStyles: {
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: '#dddddd'
              }
            }}
            pickerButtonOnPress={(item) => {
              setCountryCode(item.dial_code);
              setCountryFlag(item.flag);
              setModalVisible(false);
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: '#fff',
    width: width,
    height: height,

  }
}); 