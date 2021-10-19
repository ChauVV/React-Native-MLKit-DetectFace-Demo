import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

class ExampleApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      capturing: false,
    };
  }

  takePicture = async direction => {
    if (this.camera) {
      const options = {quality: 1, base64: true};
      const data = await this.camera.takePictureAsync(options);
      let imgs = this.state.images;
      imgs = [...imgs, data];
      this.setState({images: imgs, capturing: false});
    }
  };

  reset = () => {
    this.setState({images: [], capturing: false});
  };

  render() {
    const {images, capturing} = this.state;

    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onFacesDetected={data => {
            if (data.faces.length >= 1) {
              const face = data.faces[0];
              console.log('run');
              if (face.rollAngle > 0.3 && capturing === false) {
                if (images.length === 0) {
                  if (face.yawAngle < -36) {
                    console.log('====================================');
                    console.log('====================================');
                    console.log('LEFT', data.faces[0].rollAngle);
                    this.setState({capturing: true});
                    this.takePicture(0);
                  }
                } else if (images.length === 1) {
                  if (face.yawAngle > 36) {
                    console.log('====================================');
                    console.log('====================================');
                    console.log('RIGHT', data.faces[0].rollAngle);
                    this.setState({capturing: true});
                    this.takePicture(1);
                  }
                } else if (images.length === 2) {
                  if (face.yawAngle > -12 && face.yawAngle < 12) {
                    console.log('====================================');
                    console.log('====================================');
                    console.log('CENTER', data.faces[0].rollAngle);
                    this.setState({capturing: true});
                    this.takePicture(2);
                  }
                }
              }
            }
          }}
          onFaceDetectionError={error => {
            console.log('face--detact-->', error);
          }}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
          faceDetectionLandmarks={
            RNCamera.Constants.FaceDetection.Landmarks.all
          }
          faceDetectionClassifications={
            RNCamera.Constants.faceDetectionClassifications
          }
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => this.reset()} style={styles.capture}>
            <Text style={{fontSize: 14}}> Reset </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            position: 'absolute',
            bottom: 400,
            left: 20,
            color: 'red',
            fontSize: 30,
          }}>{`${
          images.length === 0
            ? 'Turn Left'
            : images.length === 1
            ? 'Turn Right'
            : images.length === 2
            ? 'Turn Center'
            : 'DONE'
        }`}</Text>
        {images[0] && (
          <View
            style={{
              width: '100%',
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 150,
            }}>
            <Image
              style={{width: 150, height: 150, backgroundColor: 'gray'}}
              source={images[0] ? images[0] : null}
            />
            <Image
              style={{width: 150, height: 150, backgroundColor: 'gray'}}
              source={images[2] ? images[2] : null}
            />
            <Image
              style={{width: 150, height: 150, backgroundColor: 'gray'}}
              source={images[1] ? images[1] : null}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default ExampleApp;
