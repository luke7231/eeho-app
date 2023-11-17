import { SafeAreaView, View } from "react-native";
import Navigation from "./Navigation";

const NOTCH_COLOR = "#FAFFF1";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: NOTCH_COLOR }}>
      <Navigation />
    </SafeAreaView>
  );
}
