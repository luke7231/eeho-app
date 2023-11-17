import { View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { Camera } from "expo-camera";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

export type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: HomeScreenProps) {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission?.granted) {
    // Camera permissions are not granted yet
    requestPermission();
  }
  async function onMessage(e: WebViewMessageEvent) {
    const data = e.nativeEvent.data; // 로그인 하기
    if (data === "camera") {
      navigation.navigate("Camera");
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "http://192.168.0.69:3000" }}
        onMessage={onMessage}
      />
      {/* <Text>Your expo push token: {expoPushToken}</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>
              Title: {notification && notification.request.content.title}{" "}
            </Text>
            <Text>
              Body: {notification && notification.request.content.body}
            </Text>
            <Text>
              Data:{" "}
              {notification &&
                JSON.stringify(notification.request.content.data)}
            </Text>
          </View> */}
      {/* <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      /> */}
    </View>
  );
}
