import { useEffect } from "react";
import { BackHandler } from "react-native";
import WebView from "react-native-webview";

export const useAndroidBackEffect = (
  webViewRef: React.RefObject<WebView<{}>>
) => {
  const onPressHardwareBackButton = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      onPressHardwareBackButton
    );
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        onPressHardwareBackButton
      );
    };
  }, []);
};
