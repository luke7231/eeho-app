import { RefObject } from "react";
import WebView from "react-native-webview";

const STORE_PUSH = "store_push_token";
export const postMessageStorePush = (
  token: string,
  webViewRef: RefObject<WebView>
) => {
  const data = {
    type: STORE_PUSH,
    data: token,
  };

  webViewRef.current?.postMessage(JSON.stringify(data));
};
