import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Modals from '../components/Modals';
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Camera = ({ link }) => {

    const { width, height } = useWindowDimensions();
    const ref = useRef();
    const documentId = link.split('data=')[1];

    const [video, setVideo] = useState('')
    const [paused, setPaused] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [data, setData] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)

    const startRecording = async () => {
        setIsRecording(true)
        if (paused) {
            setPaused(false)
            return ref.current.resumePreview();
        }
        const { uri } = await ref.current.recordAsync();
        setVideo(uri)
    }

    const pauseRecording = () => {
        if (isRecording) {
            setIsRecording(false)
            setPaused(true)
            ref.current.pausePreview();
        }
    }

    const submitRecording = async () => {
        ref.current.stopRecording();
        setIsRecording(false)

        const reference = storage().ref(`${data.email}-${currentIndex}`);
        await reference.putFile(video.replace('file://', ''))
        const url = await reference.getDownloadURL()
        console.log(url)

        // await firestore().collection('users').doc(documentId).update({

        // })
        
        if (currentIndex + 1 === data.questions.length) {
            Alert.alert('Completed', 'Your Response Has Been Submitted')
        } else {
            setCurrentIndex(prev => prev + 1)
        }
    }

    useEffect(() => {
        fetchData()
        // return()=>console.log('first')
    }, [])

    const fetchData = async () => {
        const data = await firestore().collection('users').doc(documentId).get();
        setData(data.data())
    }

    if (data && data.questions) return (
        <RNCamera
            onTap={pauseRecording}
            ref={ref}
            style={{ width, height, overflow: 'hidden' }}
            type='front'>

            <View style={styles.question}>
                <Text style={{ fontSize: 20 }}>{data.questions[currentIndex].value}</Text>
            </View>

            {!isRecording && <TouchableOpacity style={styles.recordingStopBtn} onPress={startRecording} >
                <MaterialCommunity name={'pause'} size={80} />
            </TouchableOpacity>
            }

            <View style={styles.btns}>
                <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                    <Text style={{ fontSize: 17 }}>Redo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={submitRecording}>
                    <Text style={{ fontSize: 17 }}>Next</Text>
                </TouchableOpacity>
            </View>

            <Modals modalVisible={modalVisible} setModalVisible={setModalVisible} errorHead={'Redo Question ?'} errorDesc={'Are you sure you want to redo this question'} />

        </RNCamera>
    )
}

export default Camera

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
    },
    btns: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        backgroundColor: 'blue',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 5
    }
});