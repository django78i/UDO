import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.UDO.app',
  appName: 'UDOblank',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '911285735248-p38u0egepsqdnjc0stbmepg11g1cf4bc.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
