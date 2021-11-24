import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.udo.health.blueprint',
  appName: 'UDO',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor:'#352D8F',
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '5000',
    },
  },
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchShowDuration: 5000,
      backgroundColor:'#352D8F'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '911285735248-p38u0egepsqdnjc0stbmepg11g1cf4bc.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
