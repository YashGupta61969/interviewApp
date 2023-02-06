import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const Camera = () => {
  const [isRecording, setIsRecording] = useState(false)
  const ref = useRef()

  const startRecording = async () => {
    if (ref) {
      setIsRecording(true)
      const { uri } = await ref.current.recordAsync();
      console.log(uri);
    }
  }
  const stopRecording = () => {
    setIsRecording(false)
    ref.current.stopRecording();  
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref}
        style={styles.preview}
        type='front'>
        <View style={styles.captureContainer}>
          <Text style={{ fontSize: 20 }}>What is The Longest River In The World</Text>
        </View>
        {isRecording ?
          <TouchableOpacity style={styles.recordingStopBtn} onPress={stopRecording} >
            <View style={{ backgroundColor: 'red', width: 40, height: 40, borderRadius: 20 }} />
          </TouchableOpacity> :
          <TouchableOpacity style={styles.recordStartBtn} onPress={startRecording} >
            <View style={{ backgroundColor: 'red', width: 70, height: 70, borderRadius: 35, borderWidth: 2 }} />
          </TouchableOpacity>
        }
      </RNCamera>

      <View style={styles.space} />
    </View>
  );
}

export default Camera

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1
  },

  preview: {
    flex: 1,
    justifyContent: 'space-between'
  },

  captureBtn: {
    backgroundColor: 'red',
    width: '100%',
    borderRadius: 50
  },
  captureContainer: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  recordStartBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    alignSelf: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  recordingStopBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 8,
    alignSelf: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});