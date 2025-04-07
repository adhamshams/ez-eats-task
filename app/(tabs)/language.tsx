import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../../contexts/languageContext';

export default function LanguageScreen() {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('languageSelection')}</Text>
      
      <View style={styles.currentLanguage}>
        <Text>{t('currentLanguage')} {language === 'en' ? t('english') : t('arabic')}</Text>
      </View>
      
      <View style={styles.languageOptions}>
        <TouchableOpacity 
          style={[styles.languageButton, language === 'en' ? styles.selectedLanguage : null]} 
          onPress={() => changeLanguage('en')}
        >
          <Text style={styles.buttonText}>{t('english')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.languageButton, language === 'ar' ? styles.selectedLanguage : null]} 
          onPress={() => changeLanguage('ar')}
        >
          <Text style={styles.buttonText}>{t('arabic')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  currentLanguage: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  languageOptions: {
    gap: 15,
  },
  languageButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#eaeaea',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
