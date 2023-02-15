import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, Alert, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Modals from '../components/Modals';
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Uploaded from '../components/Uploaded';

const Camera = ({ route, navigation }) => {

    const { width, height } = useWindowDimensions();
    const ref = useRef();
    const { link } = route.params;
    const documentId = link.split('data=')[1];
    
    const [uploaded, setUploaded] = useState(false)
    const [visible, setVisible] = useState(false)
    const [paused, setPaused] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [data, setData] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentQuestion = data && data.questions && data.questions[currentIndex];

    // Fetches all the data from firebase db
    useEffect(() => {
        firestore().collection('users').doc(documentId).get().then((res) => {
            setData(res.data())
        })
    }, [])

    // Starts Recording Video
    const startRecording = async () => {
        setIsRecording(true)
        if (paused) {
            setPaused(false)
            setIsRecording(true)
            return await ref.current.resumePreview();
        }
        try {
            const { uri } = await ref.current.recordAsync();

            if (uri) {
                setVisible(true)

                const reference = storage().ref(`${currentQuestion.value.split(' ').join('-')}-${currentQuestion.id}`);

                await reference.putFile(uri);

                const url = await reference.getDownloadURL();

                await firestore().collection('users').doc(data.id).update({
                    questions: {
                        ...data.questions,
                        [currentQuestion.id]: {
                            ...data.questions[currentQuestion.id],
                            answer: url
                        }
                    }
                })

                setUploaded(true)
                setVisible(false)

                if (currentIndex + 1 === Object.values(data.questions).length) {
                    Alert.alert('Completed', 'Your Response Has Been Submitted')
                    navigation.navigate('Welcome',{link:''})
                }
            }
        } catch (error) {
            console.log(error)
            setVisible(false)
        }
    }

    // Pauses Recording
    const pauseRecording = async () => {
        if (isRecording) {
            setIsRecording(false)
            setPaused(true)
            await ref.current.pausePreview();
        }
    }

    // Stops Recording
    const submitRecording = async () => {
        setUploaded(false)
        await ref.current.stopRecording();
        setIsRecording(false);
    }

    // Redo Question
    const redoQuestion = () => {
        ref.current.stopRecording();
        Alert.alert('Redoing A Question', 'Tap Okay To Continue');
    }

    if (data && data.questions && currentQuestion.answer) {
        if (currentIndex + 1 === Object.values(data.questions).length) {
            Alert.alert('You Have Completed Your Interview.')
            return navigation.navigate('QR')
        }
        setCurrentIndex(prev => prev + 1)
    }

    if (data && data.questions) return (
        <RNCamera
            onTap={pauseRecording}
            ref={ref}
            style={{ width, height, overflow: 'hidden' }}
            type='front'>

            <View style={styles.question}>
                <Text style={{ fontSize: 20 }}>{currentQuestion.value}</Text>
            </View>

            {!isRecording && <TouchableOpacity style={styles.recordingStopBtn} onPress={startRecording} >
                <MaterialCommunity name={'pause'} size={80} />
            </TouchableOpacity>
            }

            {/* <View style={styles.btns}>
                <TouchableOpacity style={styles.btn} onPress={redoQuestion}>
                    <Text style={{ fontSize: 17 }}>Redo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={submitRecording}>
                    <Text style={{ fontSize: 17 }}>Next</Text>
                </TouchableOpacity>
            </View> */}

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