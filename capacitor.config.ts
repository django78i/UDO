import { CapacitorConfig } from '@capacitor/cli';

// @ts-ignore
const config: CapacitorConfig = {
  appId: 'fr.udo.health.blueprint',
  appName: 'Udo',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchShowDuration: 0
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GoogleAuth: {
      scopes: [
        'profile',
        'email'
      ],
      serverClientId: '911285735248-p38u0egepsqdnjc0stbmepg11g1cf4bc.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000'
    },
    plugins: {
      'cordova-plugin-health': {
        HEALTH_READ_PERMISSION: 'App needs read access',
        HEALTH_WRITE_PERMISSION: 'App needs write access'
      }
    }
  }
};

export default config;
