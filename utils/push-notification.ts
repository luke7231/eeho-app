import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(expoPushToken: any) {
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
export async function getPushToken() {
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants?.expoConfig?.extra?.eas.projectId,
  });
  return token;
}
export async function registerForPushNotificationsAsync() {
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
    token = await getPushToken();
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token?.data;
}

/*
notification test
*/

// const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
//   const [notification, setNotification] =
//     useState<Notifications.Notification>();
//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();

// useEffect(() => {
//     console.log(permission);
//     registerForPushNotificationsAsync().then((token) =>
//       setExpoPushToken(token)
//     );

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response.notification.request.content);
//         /*
//           * 메시지 클릭 시 카메라 앱으로 보낸다.
//           * 근데  데이터를 담아서 보내야한다.
//           * 그럴려면 푸시에 데이터가 담겨있어야한다.
//           * 담긴다. data = {who: "daddy"}로 잘 왔다.
//         ​ */
//         navigation.navigate("Camera");
//       });

//     return () => {
//       Notifications.removeNotificationSubscription(
//         (
//           notificationListener as React.MutableRefObject<Notifications.Subscription>
//         ).current
//       );
//       Notifications.removeNotificationSubscription(
//         (responseListener as React.MutableRefObject<Notifications.Subscription>)
//           .current
//       );
//     };
//   }, []);
