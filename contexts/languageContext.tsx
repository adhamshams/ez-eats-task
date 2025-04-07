import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const translations = {
  en: {
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    currentLanguage: 'Current Language:',
    home: 'Home',
    ready: 'Ready',
    pickup: 'Pickup',
    delivery: 'Delivery',
    table: 'Table',
    sendSMS: 'Send SMS',
    pickedUp: 'Picked Up',
    restaurantName: 'Restaurant Name',
    restaurantHours: '8:00 - 16:00',
    waiterName: 'Waiter Name',
    // Order details screen
    orderDetails: 'Order Details',
    orderNotFound: 'Order not found',
    refund: 'Refund',
    orderedAt: 'Ordered At',
    orderType: 'Order Type',
    orderPrice: 'Order Price',
    itemDetails: 'Item Details',
    extras: 'Extras:',
    noExtras: 'No Extras',
    managerAuthorization: 'Manager Authorization',
    success: 'Success',
    error: 'Error',
    refundApproved: 'Refund has been approved and processed.',
    invalidManagerCode: 'Invalid manager code. Please try again.',
    cancel: 'Cancel',
    clear: 'Clear',
    validate: 'Validate',
    currency: 'EGP',
    saveChanges: 'Save Changes'
  },
  ar: {
    language: 'اختيار اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    currentLanguage: 'اللغة الحالية:',
    home: 'الرئيسية',
    ready: 'جاهز',
    pickup: 'استلام',
    delivery: 'توصيل',
    table: 'طاولة',
    sendSMS: 'إرسال رسالة',
    pickedUp: 'تم الاستلام',
    restaurantName: 'اسم المطعم',
    restaurantHours: '٨:٠٠ - ١٦:٠٠',
    waiterName: 'اسم النادل',
    // Order details screen
    orderDetails: 'تفاصيل الطلب',
    orderNotFound: 'الطلب غير موجود',
    refund: 'استرداد',
    orderedAt: 'وقت الطلب',
    orderType: 'نوع الطلب',
    orderPrice: 'سعر الطلب',
    itemDetails: 'تفاصيل العناصر',
    extras: 'إضافات:',
    noExtras: 'لا توجد إضافات',
    managerAuthorization: 'تفويض المدير',
    success: 'نجاح',
    error: 'خطأ',
    refundApproved: 'تمت الموافقة على الاسترداد ومعالجته.',
    invalidManagerCode: 'رمز المدير غير صالح. يرجى المحاولة مرة أخرى.',
    cancel: 'إلغاء',
    clear: 'مسح',
    validate: 'تحقق',
    currency: 'ج.م',
    saveChanges: 'حفظ التغييرات'
  }
};

export const LanguageContext = createContext<{
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}>({
  language: 'en',
  changeLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof (typeof translations)['en']] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext); 