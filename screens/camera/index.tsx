import { Camera, CameraType } from "expo-camera";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { RootStackParamList } from "../../types";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type CameraScreenRouteProp = RouteProp<RootStackParamList, "Camera">;
type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Camera"
>;

type Props = {
  route: CameraScreenRouteProp;
  navigation: CameraScreenNavigationProp;
};

export default function CameraPage({ route, navigation }: Props) {
  console.log(route.params);
  const [cameraType, setType] = useState(CameraType.back);
  const [frontReady, setFrontReady] = useState(false);

  // const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [camera2, setCamera2] = useState<Camera | null>(null);

  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);

  // if (!permission?.granted) {
  //   // Camera permissions are not granted yet
  //   requestPermission();
  // }
  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takeBackPicture() {
    if (camera) {
      const data = await camera.takePictureAsync({ isImageMirror: false });
      setBackImage(data.uri);
      setFrontReady(true);
      toggleCameraType();
    }
  }
  async function takeFrontPicture() {
    if (camera2) {
      const data = await camera2.takePictureAsync({ isImageMirror: false });
      setFrontImage(data.uri);
    }
  }
  // 바뀌는 포인트를 잡아햐는데.. 00
  // 첫 번째 노출 00
  // 첫 번쨰 찍기 00
  // 첫 번째 상태 지우기 00
  // 두 번째 오픈 ? 00
  // 두 번째 찍ㅣ 00
  // 두 번째 상태 지우기 -> 업로드 이동..

  const clickUsePhoto = () => {
    fetch;
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View style={styles.container}>
          {/* BackCamera */}
          {backImage ? (
            <Image source={{ uri: backImage }} style={{ flex: 1 }} />
          ) : (
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.camera}
              type={cameraType}
            ></Camera>
          )}

          <View style={styles.diagonal}></View>

          {/* FrontCamera */}

          {frontReady && !frontImage && (
            <Camera
              ref={(ref) => setCamera2(ref)}
              style={styles.camera}
              type={cameraType}
            ></Camera>
          )}
          {!frontReady && !frontImage && (
            <View style={{ flex: 1, backgroundColor: "black" }}></View>
          )}
          {frontImage && (
            <Image source={{ uri: frontImage }} style={{ flex: 1 }} />
          )}

          {backImage && frontImage ? (
            <View style={styles.resultBar}>
              <Text style={styles.resultText}>다시 찍기</Text>
              <Text style={styles.resultText}>사진 사용</Text>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={backImage ? takeFrontPicture : takeBackPicture}
              >
                <View style={styles.shotButton}>
                  <Text>EEHO</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#462D2D",
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  diagonal: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#462D2D",
  },
  button: {
    alignItems: "center",
    width: 90,
    height: 90,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  shotButton: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  resultBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  resultText: {
    color: "#fff",
  },
});
