import { SafeAreaView, StatusBar, Text, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { Camera } from "expo-camera";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { registerForPushNotificationsAsync } from "../utils/push-notification";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useAndroidBackEffect } from "../hooks/useAndroidBackEffect";
import styles, { NOTCH_COLOR } from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
export type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenProps;
};

export default function Home({ navigation, route }: Props) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const webViewRef = useRef<WebView>(null);
  const param = route.params;
  if (!permission?.granted) {
    requestPermission();
  }
  if (param?.goToMain) {
    if (param.goToMain.ok) {
      webViewRef.current?.postMessage("go_to_main");
    } else {
      webViewRef.current?.postMessage("go_to_main_with_error");
    }
  }
  async function onMessage(e: WebViewMessageEvent) {
    const data = e.nativeEvent.data; // 로그인 하기
    const parsedData = JSON.parse(data);
    if (parsedData.type === "camera_open") {
      navigation.navigate("Camera", parsedData.payload);
    } else if (parsedData.type === "store_token") {
      const stringValue = JSON.stringify(parsedData.payload.token);
      await AsyncStorage.setItem("jwt", stringValue);
    } else if (parsedData.type === "clear_history") {
      if (webViewRef.current && webViewRef.current.clearHistory) {
        webViewRef.current.clearHistory();
      }
    }
  }
  const sendPostMessage = (token: string) => {
    webViewRef.current?.postMessage(token);
  };

  useAndroidBackEffect(webViewRef);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      token ? sendPostMessage(token) : null
    );

    async function naviToCamera(userIds: string[]) {
      const token = await AsyncStorage.getItem("jwt");
      if (!token) return;
      const tokenWithoutQuotes = token.replace(/^"(.*)"$/, "$1");

      navigation.navigate("Camera", {
        token: tokenWithoutQuotes,
        userIds,
      });
    }

    Notifications.addNotificationResponseReceivedListener((response) => {
      // from: userId
      // userId로 보낸다.
      if (response.notification.request.content.data.from) {
        naviToCamera([response.notification.request.content.data.from]);
      }
    });
  }, [webViewRef.current]);
  return (
    <>
      <StatusBar backgroundColor={NOTCH_COLOR} barStyle={"dark-content"} />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            source={{ uri: "https://eeho-web.vercel.app" }}
            onMessage={onMessage}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
