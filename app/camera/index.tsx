import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraPage() {
  const [backCameraType, setType] = useState(CameraType.back);
  const [frontReady, setFrontReady] = useState(false);
  const [frontCameraType, setType2] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [camera2, setCamera2] = useState<Camera | null>(null);

  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);

  if (!permission?.granted) {
    // Camera permissions are not granted yet
    requestPermission();
  }

  async function takeBackPicture() {
    if (camera) {
      const data = await camera.takePictureAsync({ isImageMirror: false });
      setBackImage(data.uri);
      setFrontReady(true);
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
  return (
    <View style={styles.container}>
      {/* BackCamera */}
      {backImage ? (
        <Image source={{ uri: backImage }} style={{ flex: 1 }} />
      ) : (
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.camera}
          type={backCameraType}
        ></Camera>
      )}

      <View style={styles.diagonal}></View>

      {/* FrontCamera */}
      {frontReady && !frontImage && (
        <Camera
          ref={(ref) => setCamera2(ref)}
          style={styles.camera}
          type={frontCameraType}
        ></Camera>
      )}
      {!frontReady && !frontImage && (
        <View style={{ flex: 1, backgroundColor: "black" }}></View>
      )}
      {frontImage && <Image source={{ uri: frontImage }} style={{ flex: 1 }} />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={frontImage ? takeFrontPicture : takeBackPicture}
        >
          <View style={styles.shotButton}>
            <Text>EEHO</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 48,
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: "#462D2D",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
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
});
