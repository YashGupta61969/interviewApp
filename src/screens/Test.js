import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Carousel from 'react-native-snap-carousel';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Modals from '../components/Modals';

const Test = () => {
    const ref = useRef();
    const cameraRef = useRef()
    const { width, height } = useWindowDimensions();

    const [video, setVideo] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [paused, setPaused] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const startRecording = async () => {
        if (ref) {
            // setIsRecording(true)
            if (paused) {
                setPaused(false)
                return ref.current.resumePreview();
            }
            const { uri } = await ref.current.recordAsync();
            setVideo(uri)
        }
    }

    const pauseRecording = () => {
        setIsRecording(false)
        setPaused(true)
        ref.current.pausePreview();
    }

    const renderItem = ({ item }) => {
        return <RNCamera
            // onTap={stopRecording}
            ref={cameraRef}
            style={{ width, height }}
            type='front'>

            <View style={styles.question}>
                <Text style={{ fontSize: 20 }}>{item}</Text>
            </View>

            {!isRecording && <TouchableOpacity style={styles.recordingStopBtn} onPress={startRecording} >
                <MaterialCommunity name={'pause'} size={80} />
            </TouchableOpacity>
            }

            <Modals modalVisible={modalVisible} setModalVisible={setModalVisible} errorHead={'Redo Question ?'} errorDesc={'Are you sure you want to redo this question'} />

        </RNCamera>
    }

    return (
        <Carousel
            ref={ref}
            data={['Who Are You', 'What Are You', 'Why Are You', 'How Are You', 'When Are You']}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={height}
            swipeThreshold={50}
            lockScrollWhileSnapping
        />
    );
}

export default Test

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: 'black',
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
        top: '45%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
});