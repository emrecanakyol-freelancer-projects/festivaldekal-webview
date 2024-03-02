import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  RefreshControl,
  ScrollView,
  BackHandler,
  Platform,
  Linking,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import {OneSignal} from 'react-native-onesignal';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

const App = () => {
  const [refresherEnabled, setEnableRefresher] = useState(true);
  const webViewRef: any = useRef();
  const [canGoBack, setCanGoBack] = useState(false);
  const oneSignalID =
    Platform.OS === 'ios' ? '1196c18d-f5ad-45b8-baef-ef3c090c20bb' : '';

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  //Pull To Down Refresh
  const handleScroll = (res: any) => {
    const yOffset = Number(res.nativeEvent.contentOffset.y);
    if (yOffset === 0) {
      setEnableRefresher(true);
    } else {
      setEnableRefresher(false);
    }
  };

  const requestPermissionTransparency = async () => {
    return await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
  };

  useEffect(() => {
    OneSignal.initialize(oneSignalID);
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('click', event => {
      console.log('OneSignal: notification clicked:', event);
    });
  }, [OneSignal]);

  useEffect(() => {
    SplashScreen.hide();
    requestPermissionTransparency();
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, [handleBack]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={false}
            enabled={refresherEnabled}
            onRefresh={() => {
              webViewRef.current.reload();
            }}
          />
        }>
        <WebView
          source={{uri: 'https://festivaldekal.com/'}}
          onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
          ref={webViewRef}
          originWhitelist={['*']}
          onScroll={handleScroll}
          allowsInlineMediaPlayback
          javaScriptEnabled
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabledAndroid
          useWebkit
          startInLoadingState
          cacheEnabled
          allowsFullscreenVideo
          setBuiltInZoomControls
          onShouldStartLoadWithRequest={request => {
            const {url} = request;
            if (url.includes('tel:')) {
              Linking.openURL(url);
              // request.url && webViewRef.current.goBack();
              return false;
            } else if (url.includes('wa.me/')) {
              Linking.openURL(url);
              return false;
            } else if (url.includes('www.facebook.com')) {
              Linking.openURL(url);
              return false;
            } else if (url.includes('twitter.com')) {
              Linking.openURL(url);
              return false;
            } else if (url.includes('www.linkedin.com')) {
              Linking.openURL(url);
              return false;
            } else if (url.includes('pinterest.com')) {
              Linking.openURL(url);
              return false;
            } else if (url.includes('telegram.me')) {
              Linking.openURL(url);
              return false;
            } else if (url.includes('www.youtube.com')) {
              Linking.openURL(url);
              return false;
            }
            return true;
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
