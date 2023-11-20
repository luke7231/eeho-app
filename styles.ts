import { Platform, StatusBar, StyleSheet } from "react-native";

const NOTCH_COLOR = "#FAFFF1";

export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: NOTCH_COLOR,
    paddingBottom: Platform.OS === "android" ? 24 : 0,
  },
});
