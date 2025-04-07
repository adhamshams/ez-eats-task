import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useLanguage } from '../../contexts/languageContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LanguageScreen() {
  const { language, changeLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleSaveChanges = () => {
    changeLanguage(selectedLanguage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { textAlign: language === 'ar' ? 'right' : 'left' }]}>{t('language')}</Text>
      
      <View style={styles.languageOptions}>
        <TouchableOpacity 
          style={styles.languageOption}
          onPress={() => setSelectedLanguage('ar')}
        >
          <View style={styles.languageRow}>
            <Image 
              source={require('../../assets/images/egypt-flag.png')} 
              style={styles.flag}
            />
            <Text style={styles.languageText}>{t('arabic')}</Text>
          </View>
          <View style={[
            styles.radio, 
            selectedLanguage === 'ar' && styles.radioSelected
          ]}>
            {selectedLanguage === 'ar' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.languageOption}
          onPress={() => setSelectedLanguage('en')}
        >
          <View style={styles.languageRow}>
            <Image 
              source={require('../../assets/images/usa-flag.png')} 
              style={styles.flag}
            />
            <Text style={styles.languageText}>{t('english')}</Text>
          </View>
          <View style={[
            styles.radio, 
            selectedLanguage === 'en' && styles.radioSelected
          ]}>
            {selectedLanguage === 'en' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSaveChanges}
      >
        <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 15,
  },
  title: {
    fontSize: 25, 
    fontFamily: 'SFProDisplay',
    marginBottom: 15,
    color: '#333',
  },
  languageOptions: {
    gap: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flag: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  languageText: {
    fontSize: 18,
    fontFamily: 'SFProDisplay',
    color: '#333',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#283593',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: '#283593',
  },
  saveButton: {
    backgroundColor: '#283593',
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
    marginHorizontal: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'SFProDisplay',
  },
});
