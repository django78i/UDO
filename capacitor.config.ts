import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.udo.health.blueprint',
  appName: 'UDO',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: '#352D8F',
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '5000',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '5000',
    },
  },
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchShowDuration: 5000,
      backgroundColor: '#352D8F',
      launchAutoHide: false,
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '911285735248-p38u0egepsqdnjc0stbmepg11g1cf4bc.apps.googleusercontent.com.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
