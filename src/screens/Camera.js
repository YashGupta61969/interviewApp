import { StyleSheet, Text, useWindowDimensions, TouchableOpacity, Alert, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Modals from '../components/Modals';
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';
import Uploaded from '../components/Uploaded';
import { useIsFocused } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

const Camera = ({ route, navigation }) => {

    const { width, height } = useWindowDimensions();
    const ref = useRef();
    const redoRef = useRef(false)
    const swipeRef = useRef();
    const { link, questionId } = route.params;
    const isFocused = useIsFocused();
    const documentId = link.split('data=')[1];

    const [position] = useState(new Animated.Value(0));
    const [fontSize] = useState(new Animated.Value(36));
    const [uploaded, setUploaded] = useState(false)
    const [visible, setVisible] = useState(false)
    const [paused, setPaused] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [data, setData] = useState({})
    const [animatedViewHeight, setAnimatedViewHeight] = useState(0)
    const currentQuestion = data && data.questions && data.questions[questionId];

    useEffect(() => {

        position.setValue(0)
        fontSize.setValue(36)

        // Text Animations
        Animated.timing(position, {
            toValue: 1,
            duration: 1500,
            delay: 2500,
            useNativeDriver: true,
        }).start(),

            Animated.timing(fontSize, {
                toValue: 20,
                duration: 1500,
                delay: 2500,
                useNativeDriver: false,
            }).start(),

            // Fetches the question from firebase
            firestore().collection('users').doc(documentId).get().then((res) => {
                setData(res.data())
            });
    }, [isFocused, questionId]);

    // Translates Question Text From Center to Bottom With ANimation
    const translateY = position.interpolate({
        inputRange: [0, 1],
        outputRange: [(height - animatedViewHeight) / 2, height - animatedViewHeight],
        extrapolate: "clamp",
    });

    //   Uploads Video To Server
    const uploadVideo = async (uri) => {
        if (redoRef.current) {
            redoRef.current = false
            return;
        }
        setVisible(true)

        const form = new FormData()

        try {
            form.append('video', {
                uri: uri,
                type: 'video/mp4',
                name: `${currentQuestion.value}-${currentQuestion.id}`
            })
            form.append('documentId', documentId)

            const response = await fetch('http://142.93.219.133/video-app/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form
            });
            console.log(await response.json())
            setUploaded(true)
            setVisible(false)


            const questionsLength = Object.values(data.questions).length;
            const areMoreQuestionas = Object.values(data.questions).some(ques => !ques.answer)

            // Checks if There are more questions. If none, then navigqate to Welcome Screen, else display next question
            if (questionId + 1 === questionsLength || !areMoreQuestionas) {
                Alert.alert('Completed', 'Your Response Has Been Submitted')
                navigation.navigate('Welcome', { link: 'empty' })
            } else {
                navigation.navigate(`Camera${questionId + 1}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Starts Recording Video
    const startRecording = async () => {
        setIsRecording(true)
        if (paused) {
            setPaused(false)
            setIsRecording(true)
            return await ref.current.resumeRecording();
        }
        try {
            const { uri } = await ref.current.recordAsync({
                orientation:"landscapeLeft"
            });
            if (uri) {
                uploadVideo(uri)
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
            await ref.current.pauseRecording();
        }
    }

    // Stops Recording
    const submitRecording = async () => {
        setUploaded(false)
        setIsRecording(false);
        await ref.current.stopRecording();
    }

    // Redo Question
    const redoQuestion = () => {
        setIsRecording(false)
        Alert.alert('Redoing A Question', 'Are you sure you want to redo this question ?', [
            {
                text: 'Cancel',
                onPress: () => { return; },
            },
            {
                text: 'Okay',
                onPress: async () => {
                    redoRef.current = true
                    await ref.current.stopRecording();
                },
            },
        ]);
    }

    // Listener on Swipe
    const onSwipeableOpen = (direction) => {
        swipeRef.current.close();
        if (direction === 'left') {
            redoQuestion();
        } else {
            submitRecording()
        }
    }

    const onLayout = (event)=>{
        const heightOfView = event.nativeEvent.layout.height
        setAnimatedViewHeight(heightOfView)
    }

    // display questions
    if (data && data.questions && isFocused) return (
        <Swipeable
            ref={swipeRef}
            onSwipeableOpen={onSwipeableOpen}
            renderLeftActions={() => <Text>.</Text>}
            renderRightActions={() => <Text>.</Text>}
        >

            <RNCamera
                onTap={pauseRecording}
                ref={ref}
                style={{ width, height, overflow: 'hidden' }}
                type='front'>

                <Animated.View style={[styles.question, { transform: [{ translateY }] }]} onLayout={onLayout}>
                    <Animated.Text style={[styles.questionText, { fontSize }]}>{currentQuestion?.value}</Animated.Text>
                </Animated.View>

                {!isRecording && <TouchableOpacity style={styles.recordingStopBtn} onPress={startRecording} >
                    <MaterialCommunity name={'pause'} size={80} color='white' />
                </TouchableOpacity>
                }

                <Modals modalVisible={modalVisible} setModalVisible={setModalVisible} errorHead={'Redo Question ?'} errorDesc={'Are you sure you want to redo this question'} />

                <Uploaded setVisible={setVisible} visible={visible} uploaded={uploaded} />
            </RNCamera>
        </Swipeable>
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
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingHorizontal: 8,
    },
    recordingStopBtn: {
        position: 'absolute',
        top: '50%',
        transform: [
            { translateY: -50 }
        ],
        backgroundColor: 'rgba(227, 89, 255,0.3)',
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
    },
    questionText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgb(227, 89, 255)',
        textShadowOffset: { width: -5, height: -3 },
        textShadowRadius: 5,
        // position:'absolute',
        // left:0,
        // right:0,
    }
});