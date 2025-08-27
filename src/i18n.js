import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhTW from './locales/zh-TW.json';
import enUS from './locales/en-US.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': { translation: zhTW },
      'en-US': { translation: enUS },
    },
    lng: 'zh-TW', // 預設語言
    fallbackLng: 'zh-TW',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;