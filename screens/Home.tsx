import { Button, Platform, Text, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken: any) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas.projectId,
    });
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}

export default function Home() {
  // function onMessage(e: WebViewMessageEvent) {
  //   console.log(e.nativeEvent.data);
  //   const payload = e.nativeEvent.data;

  //   if (payload === "camera") {
  //     router.replace("/camera");
  //   }
  // }
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Device.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       alert("Failed to get push token for push notification!");
  //       return;
  //     }
  //     token = (
  //       await Notifications.getExpoPushTokenAsync({
  //         projectId: Constants?.expoConfig?.extra?.eas.projectId,
  //       })
  //     ).data;
  //     console.log(token);
  //   } else {
  //     alert("Must use physical device for Push Notifications");
  //   }

  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  //   return token;
  // }
  if (!permission?.granted) {
    // Camera permissions are not granted yet
    requestPermission();
  }
  useEffect(() => {
    console.log(permission);
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response.notification.request.content);
        /*
          * 메시지 클릭 시 카메라 앱으로 보낸다.
          * 근데  데이터를 담아서 보내야한다.
          * 그럴려면 푸시에 데이터가 담겨있어야한다.
          * 담긴다. data = {who: "daddy"}로 잘 왔다.
        ​ */
        // router.replace("/camera");
      });

    return () => {
      Notifications.removeNotificationSubscription(
        (
          notificationListener as React.MutableRefObject<Notifications.Subscription>
        ).current
      );
      Notifications.removeNotificationSubscription(
        (responseListener as React.MutableRefObject<Notifications.Subscription>)
          .current
      );
    };
  }, []);
  const { top } = useSafeAreaInsets();
  return (
    // <View style={{ flex: 1 }}>
    //   {/* <SafeAreaView style={{ flex: 0, backgroundColor: "red" }} /> */}
    //   {/* <WebView
    //     source={{ uri: "http://192.168.45.27:3000" }}
    //     onMessage={onMessage}
    //   /> */}
    //   {/* <Text>Your expo push token: {expoPushToken}</Text>
    //       <View style={{ alignItems: "center", justifyContent: "center" }}>
    //         <Text>
    //           Title: {notification && notification.request.content.title}{" "}
    //         </Text>
    //         <Text>
    //           Body: {notification && notification.request.content.body}
    //         </Text>
    //         <Text>
    //           Data:{" "}
    //           {notification &&
    //             JSON.stringify(notification.request.content.data)}
    //         </Text>
    //       </View> */}
    //   <Button
    //     title="Press to Send Notification"
    //     onPress={async () => {
    //       await sendPushNotification(expoPushToken);
    //     }}
    //   />
    //   <Button
    //     title="go to camera"
    //     onPress={() => {
    //       router.push("/camera");
    //     }}
    //   />
    // </View>
    <View>
      <Text>hasdasdasdi</Text>
    </View>
  );
}
