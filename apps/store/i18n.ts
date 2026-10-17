import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale && ['ar', 'en'].includes(locale) ? locale : 'ar';
  return {
    messages: (await import(`./messages/${currentLocale}.json`)).default
  };
});