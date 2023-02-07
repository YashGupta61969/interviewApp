import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Modals from '../components/Modals';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'

const Camera = () => {
  const ref = useRef();
  const swipeRef = useRef()

  const [isRecording, setIsRecording] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const startRecording = async () => {
    if (ref) {
      setIsRecording(true)
      const { uri } = await ref.current.recordAsync();
      ref.current.resumePreview();
      //  resumePreview
      console.log(uri);
    }
  }
  const stopRecording = () => {
    console.log('fhdsf')
    setIsRecording(false)
    ref.current.pausePreview();
  }

  const onSwipeOpen = (e) => {
    if (e === 'left') {
      setModalVisible(true)
    }
  }

  return (
    <Swipeable
      ref={swipeRef}
      onSwipeableOpen={onSwipeOpen}
      renderLeftActions={(e) => {
        return <Text style={{ flex: 1 }}>jifjewejwgghjjykkkjfg</Text>
      }}
      renderRightActions={() => <Text style={{ flex: 1 }}>efbhdkjsbhdkjsgbdhskjugbdhs</Text>}
      containerStyle={{ flex: 1 }}
      childrenContainerStyle={styles.container}
    >
      <Modals modalVisible={modalVisible} setModalVisible={setModalVisible} errorHead={'Redo Question ?'} errorDesc={'Are you sure you want to redo this question'} action={swipeRef.current} />

      <RNCamera
        onTap={stopRecording}
        ref={ref}
        style={{ ...styles.preview }}
        type='front'>

        <View style={styles.question}>
          <Text style={{ fontSize: 20 }}>What is The Longest River In The World</Text>
        </View>

        {!isRecording &&
          <TouchableOpacity style={styles.recordingStopBtn} onPress={startRecording} >
            {/* <View style={{ backgroundColor: 'red', width: 40, height: 40, borderRadius: 20 }} /> */}
            <MaterialCommunity name={'pause'} size={80}/>
          </TouchableOpacity>
        }

      </RNCamera>

    </Swipeable>
  );
}

export default Camera

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  preview: {
    flex: 1,
    overflow: 'hidden'
  },
  question: {
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  recordingStopBtn: {
    position: 'absolute',
    top:'45%',
    backgroundColor:'rgba(0,0,0,0.2)',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
});