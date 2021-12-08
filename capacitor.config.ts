import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.UDO.app',
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
      launchShowDuration: 20000,
      backgroundColor: '#352D8F',
      launchAutoHide: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true
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
