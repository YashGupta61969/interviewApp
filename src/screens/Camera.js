import { StyleSheet, useWindowDimensions, TouchableOpacity, Animated, View, Modal, Text } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo'
import { useDispatch } from 'react-redux';
import { addVideoFile, updateIsCompleted } from '../store/slices/userSlice';
import colors from '../constants/colors';

const Camera = ({ route, navigation }) => {

    const ref = useRef();
    const redoRef = useRef(false)
    const swipeRef = useRef();
    const { width, height } = useWindowDimensions();
    const { link, questionId } = route.params;
    const isFocused = useIsFocused();
    const documentId = link.split('data=')[1];
    const dispatch = useDispatch()

    const [position] = useState(new Animated.Value(0));
    const [fontSize] = useState(new Animated.Value(45));
    const [paused, setPaused] = useState(false)
    const [redoModalVisible, setRedoModalVisible] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [data, setData] = useState({})
    const [animatedViewHeight, setAnimatedViewHeight] = useState(0)
    const currentQuestion = data && data.questions && data.questions[questionId];

    useEffect(() => {
        position.setValue(0)
        fontSize.setValue(50)

        // Text Animations
        Animated.timing(position, {
            toValue: 1,
            duration: 1500,
            delay: 2500,
            useNativeDriver: true,
        }).start()

        Animated.timing(fontSize, {
            toValue: 26,
            duration: 1500,
            delay: 2500,
            useNativeDriver: false,
        }).start()

        // Fetches the question from firebase
    }, [isFocused, redoModalVisible]);
    
    useEffect(()=>{
        // startRecording();

        firestore().collection('users').doc(documentId).get().then((res) => {
            setData(res.data())
        });
    },[isFocused])

    // Translates Question Text From Center to Bottom With Ansimation
    const translateY = position.interpolate({
        inputRange: [0, 1],
        outputRange: [(height - animatedViewHeight) / 2, height - animatedViewHeight],
        // extrapolate: "extend",
    });

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
                orientation: "landscapeLeft",
            });
            if (uri) {

                dispatch(addVideoFile({
                    name: `${currentQuestion.value}~${currentQuestion.id}`,
                    uri,
                }))

                const questionsLength = data.questions.length;
                const areMoreQuestionas = data.questions.some(ques => !ques.answer)

                // Checks if There are more questions. If none, then navigate to Welcome Screen, else display next question
                if (!areMoreQuestionas || questionId + 1 === questionsLength) {
                    dispatch(updateIsCompleted(true))
                    navigation.navigate('Upload', { documentId })
                } else {
                    navigation.navigate(`Camera${questionId + 1}`)
                }
            }
        } catch (error) {
            console.log(error)
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
        setIsRecording(false);
        await ref.current.stopRecording();
    }

    // Redo Question
    const redoQuestion = () => {
        setIsRecording(false)
        setRedoModalVisible(true)
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

    // Sets height of animated text
    const onLayout = (event) => {
        const heightOfView = event.nativeEvent.layout.height
        setAnimatedViewHeight(heightOfView)
    }

    {/* Camera View */ }
    if (data && data.questions && isFocused) return (
        <Swipeable
            ref={swipeRef}
            onSwipeableOpen={onSwipeableOpen}
            renderLeftActions={() => <View style={{ width: width / 3, backgroundColor: 'black' }} />}
            renderRightActions={() => <View style={{ width: width / 3, backgroundColor: 'black' }} />}
        >
            <RNCamera
                onTap={pauseRecording}
                ref={ref}
                style={{ width, height, overflow: 'hidden' }}
                type='front'>

                {/* Animated Text */}
                {!redoModalVisible && <Animated.View style={[styles.question, { transform: [{ translateY }] }]} onLayout={onLayout}>
                    <Animated.Text style={[styles.questionText, { fontSize }]}>{currentQuestion?.value}</Animated.Text>
                </Animated.View>}

                {/* Paused Icon */}
                {!redoModalVisible && !isRecording && <TouchableOpacity style={styles.recordingStopBtn} onPress={startRecording} >
                    <MaterialCommunity name={'pause'} size={80} color='white' />
                </TouchableOpacity>
                }

                {/* Redo Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={redoModalVisible}>

                    <View style={{ ...styles.modal, height, width }}>
                        <Text style={styles.redoText}>Redo Question</Text>
                        <View style={styles.icons}>
                            <MaterialCommunity name={'check'} size={80} color={colors.primary} onPress={async () => {
                                redoRef.current = true
                                setRedoModalVisible(false)
                                try {
                                    await ref.current.stopRecording();
                                } catch (err) {
                                    console.log(err)
                                }
                            }} />
                            <Entypo name={'cross'} size={80} color={colors.primary} onPress={() => {
                                setRedoModalVisible(false)
                            }} />
                        </View>
                    </View>
                </Modal>
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
        zIndex: 5,
        alignItems: 'center'
    },
    questionText: {
        color: 'white',
        textAlign: 'center',
        textShadowColor: colors.primary,
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 10,
        zIndex: 8,
        fontFamily: 'BarlowCondensed-SemiBold',
    },
    modal: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    redoText: {
        color: colors.primary,
        fontSize: 40,
        fontFamily: 'BarlowCondensed-SemiBold',
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '30%'
    }
});