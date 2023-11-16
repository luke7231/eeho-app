import { Link, useNavigation } from "expo-router";
import { Button, Text, View } from "react-native";
import { router } from "expo-router";
import WebView, { WebViewMessageEvent } from "react-native-webview";

export default function Page() {
  function onMessage(e: WebViewMessageEvent) {
    console.log(e.nativeEvent.data);
    const payload = e.nativeEvent.data;

    if (payload === "camera") {
      router.replace("/camera");
    }
  }
  // function onMessage(e: WebViewMessageEvent) {
  //   const data = e.nativeEvent.data;
  //   const parsedData = JSON.parse(data);
  //   const { type } = parsedData as { type: MessageTypes };
  //   const { payload } = parsedData as { payload: InputTypeMap[typeof type] };

  //   switch (type) {
  //     case "NATIVE_EVENT":
  //       if (payload.method === "navigate") navigate(payload.params);
  //       else
  //         handleReceiveMessage(type, payload as InputTypeMap["NATIVE_EVENT"]);
  //       break;
  //     case "PAGE_EVENT":
  //       pageEvent(payload as InputTypeMap["PAGE_EVENT"]);
  //       break;
  //     case "AMPLITUDE":
  //       handleReceiveMessage(type, payload as InputTypeMap["AMPLITUDE"]);
  //       break;
  //     case "LANGUAGE":
  //       handleReceiveMessage(type, payload as InputTypeMap["LANGUAGE"]);
  //       break;
  //     case "AUTH":
  //       handleReceiveMessage(type, payload as InputTypeMap["AUTH"]);
  //       break;
  //     default:
  //       console.error("Invalid Message Spec");
  //   }
  // }
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "http://172.16.231.24:3000" }}
        onMessage={onMessage}
      />
    </View>
  );
}
