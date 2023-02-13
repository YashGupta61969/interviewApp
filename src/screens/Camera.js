import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, Alert, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Modals from '../components/Modals';
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';
import Uploaded from '../components/Uploaded';

const Camera = ({ link }) => {

    const { width, height } = useWindowDimensions();
    const ref = useRef();
    const documentId = link.split('data=')[1];

    const [uploaded, setUploaded] = useState(false)
    const [visible, setVisible] = useState(false)
    const [paused, setPaused] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [data, setData] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        firestore().collection('users').doc(documentId).get().then((data) => setData(data.data()))
    }, [])

    console.log(data)

    const startRecording = async () => {
        setIsRecording(true)
        if (paused) {
            setPaused(false)
            setIsRecording(true)
            return ref.current.resumePreview();
        }
        try {
            const { uri } = await ref.current.recordAsync();

            if (uri) {
                setVisible(true)
                const form = new FormData()

                form.append('documentId',documentId)

                form.append('video', {
                    name: `${data?.questions?.[currentIndex]?.value}-${data?.questions?.[currentIndex]?.id}`,
                    uri: uri,
                    type: 'video/mp4'
                })

                const response = await fetch('http://142.93.219.133/video-app/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: form
                });

                const data = await response.json()
                setUploaded(true)
                setVisible(false)

                if (currentIndex + 1 === data?.questions?.length) {
                    Alert.alert('Completed', 'Your Response Has Been Submitted')
                } else {
                    setCurrentIndex(prev => prev + 1)
                }
            }
        } catch (error) {
            console.log('error posting', error)
            setVisible(false)
        }
    }

    const pauseRecording = () => {
        if (isRecording) {
            setIsRecording(false)
            setPaused(true)
            ref.current.pausePreview();
        }
    }


    const submitRecording = async () => {
        await ref.current.stopRecording();
        setIsRecording(false);
    }


    const redoQuestion = () => {
        ref.current.stopRecording();
        Alert.alert('Redoing A Question', 'Tap Okay To Continue');
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
                <TouchableOpacity style={styles.btn} onPress={redoQuestion}>
                    <Text style={{ fontSize: 17 }}>Redo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={submitRecording}>
                    <Text style={{ fontSize: 17 }}>Next</Text>
                </TouchableOpacity>
            </View>

            <Modals modalVisible={modalVisible} setModalVisible={setModalVisible} errorHead={'Redo Question ?'} errorDesc={'Are you sure you want to redo this question'} />

            <Uploaded setVisible={setVisible} visible={visible} uploaded={uploaded} />
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