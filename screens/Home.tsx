import {
  BackHandler,
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { Camera } from "expo-camera";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { registerForPushNotificationsAsync } from "../utils/push-notification";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useAndroidBackEffect } from "../hooks/useAndroidBackEffect";
import styles, { NOTCH_COLOR } from "../styles";
export type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: HomeScreenProps) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const webViewRef = useRef<WebView>(null);
  if (!permission?.granted) {
    requestPermission();
  }
  async function onMessage(e: WebViewMessageEvent) {
    const data = e.nativeEvent.data; // 로그인 하기
    const parsedData = JSON.parse(data);
    if (parsedData.type === "camera_open") {
      navigation.navigate("Camera", parsedData.payload);
    }
  }
  const sendPostMessage = (token: string) => {
    webViewRef.current?.postMessage(token);
    console.log(token, "완료");
  };

  useAndroidBackEffect(webViewRef);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      token ? sendPostMessage(token) : null
    );

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response.notification.request.content);
    });
  }, [webViewRef.current]);
  return (
    <>
      <StatusBar backgroundColor={NOTCH_COLOR} barStyle={"dark-content"} />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={{ flex: 1 }}>
          {/* <Button title="To Camera" onPress={() => navigation.navigate("Camera")} /> */}
          <WebView
            ref={webViewRef}
            source={{ uri: "http://172.16.225.128:3000" }}
            onMessage={onMessage}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
