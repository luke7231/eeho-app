import { Platform, StatusBar, StyleSheet } from "react-native";

export const NOTCH_COLOR = "#FAFFF1";
export const CAMERA_NOTCH_COLOR = "#162A0C";
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: NOTCH_COLOR,
    paddingBottom: Platform.OS === "android" ? 24 : 0,
  },
  cameraSafeAreaView: {
    flex: 1,
    backgroundColor: CAMERA_NOTCH_COLOR,
    paddingBottom: Platform.OS === "android" ? 24 : 0,
  },
});
