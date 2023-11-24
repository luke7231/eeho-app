import { Camera, CameraType } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import globalStyles, { CAMERA_NOTCH_COLOR } from "../../styles";

import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ViewProps,
  ActivityIndicator,
} from "react-native";
import { RootStackParamList } from "../../types";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";

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
  const captureRef = useRef(null);
  const token = route.params.token;
  const receiverIds = route.params.userIds;

  const [cameraType, setType] = useState(CameraType.back);
  const [frontReady, setFrontReady] = useState(false);

  // const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [camera2, setCamera2] = useState<Camera | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [canTakeShot, setCanTakeShot] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takeBackPicture() {
    setCanTakeShot(false);
    if (camera) {
      const data = await camera.takePictureAsync({
        isImageMirror: false,
      });
      setBackImage(data.uri);
      setFrontReady(true);
      toggleCameraType();
    }
  }
  async function takeFrontPicture() {
    setCanTakeShot(false);
    if (camera2) {
      const data = await camera2.takePictureAsync({
        isImageMirror: false,
      });
      setFrontImage(data.uri);
      setCanTakeShot(true);
    }
  }
  const getPhotoUri = async (): Promise<string> => {
    const uri = await (captureRef.current as any).capture();
    console.log("😍" + uri);
    return uri;
  };

  const onClickReTakePhoto = () => {
    setBackImage(null);
    setFrontImage(null);
    setFrontReady(false);
    setCanTakeShot(true);
    toggleCameraType();
  };
  const clickUsePhoto = async () => {
    setSubmitLoading(true);
    const capturedPath = await getPhotoUri();
    const updatedPath = capturedPath.replace("/private/", "file:///");
    FileSystem.uploadAsync(
      "https://eeho-b890d.du.r.appspot.com/album/image/upload",
      updatedPath,
      {
        fieldName: "profile",
        headers: { token },
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        parameters: {
          receiverIds: JSON.stringify(receiverIds),
        },
      }
    )
      .then((res) => {
        return JSON.parse(res.body);
      })
      .then((data) => {
        if (data.ok) {
          navigation.navigate("Home", {
            goToMain: {
              ok: true,
            },
          });
        } else {
          navigation.navigate("Home", { goToMain: { ok: false } });
        }
      });
  };

  return (
    <>
      <StatusBar
        backgroundColor={CAMERA_NOTCH_COLOR}
        barStyle={"dark-content"}
      />
      <SafeAreaView style={globalStyles.cameraSafeAreaView}>
        <View style={styles.container}>
          <ViewShot ref={captureRef} style={styles.viewShot}>
            {/* BackCamera */}
            {backImage ? (
              <Image source={{ uri: backImage }} style={{ flex: 1 }} />
            ) : (
              <Camera
                ref={(ref) => setCamera(ref)}
                style={styles.camera}
                type={cameraType}
                ratio="1:1"
              ></Camera>
            )}

            {/* FrontCamera */}

            {frontReady && !frontImage && (
              <Camera
                ref={(ref) => setCamera2(ref)}
                style={styles.camera}
                type={cameraType}
                ratio="1:1"
                onCameraReady={() => setCanTakeShot(true)}
              ></Camera>
            )}
            {!frontReady && !frontImage && (
              <View style={styles.cover}>
                <Image
                  source={require("../../assets/EEHO_LOGO.png")}
                  style={styles.logo}
                />
              </View>
            )}
            {frontImage && (
              <Image source={{ uri: frontImage }} style={{ flex: 1 }} />
            )}
          </ViewShot>

          {/* <Button title="클릭 시 캡처" onPress={getPhotoUri} /> */}

          {backImage && frontImage ? (
            submitLoading ? (
              <ActivityIndicator size="large" style={{ marginTop: 12 }} />
            ) : (
              <View style={styles.resultBar}>
                <Text style={styles.resultText} onPress={onClickReTakePhoto}>
                  다시 찍기
                </Text>
                <Text style={styles.resultText} onPress={clickUsePhoto}>
                  사진 사용
                </Text>
              </View>
            )
          ) : (
            <View style={styles.buttonContainer}>
              {canTakeShot ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={backImage ? takeFrontPicture : takeBackPicture}
                >
                  <View style={styles.shotButton}>
                    <Text style={styles.shotText}>{backImage ? 2 : 1}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <ActivityIndicator
                  size="large"
                  style={{ marginTop: 44, marginBottom: 10 }}
                />
              )}
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
    backgroundColor: "#162A0C",
    padding: 20,
  },
  viewShot: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#162A0C",
    borderWidth: 5,
    borderColor: "#fff",
    borderStyle: "solid",
    // marginBottom: 38,
  },
  camera: {
    flex: 1,
  },
  cover: {
    flex: 1,
    backgroundColor: "#FFFFFF4D",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 68,
    objectFit: "contain",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
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
    width: 78,
    height: 78,
    backgroundColor: "#162A0C",
    borderWidth: 5,
    borderColor: "#fff",
    borderStyle: "solid",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  shotText: {
    fontSize: 36,
    color: "#fff",
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
