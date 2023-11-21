import { SafeAreaView, StatusBar, View } from "react-native";
import Navigation from "./Navigation";
import { useEffect } from "react";
import styles from "./styles";
const NOTCH_COLOR = "#FAFFF1";

export default function App() {
  useEffect(() => {
    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notification) => {
    //     setNotification(notification);
    //   });
    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log(response.notification.request.content);
    //     /*
    //       * 메시지 클릭 시 카메라 앱으로 보낸다.
    //       * 근데  데이터를 담아서 보내야한다.
    //       * 그럴려면 푸시에 데이터가 담겨있어야한다.
    //       * 담긴다. data = {who: "daddy"}로 잘 왔다.
    //     ​ */
    //     navigation.navigate("Camera");
    //   });
  }, []);
  return (
    <>
      <Navigation />
    </>
  );
}
