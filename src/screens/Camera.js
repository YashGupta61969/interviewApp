import { StyleSheet, useWindowDimensions, Animated, View, Modal, Text, BackHandler } from 'react-native'
import React, { useState, useRef, useEffect, forwardRef } from 'react'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo'
import { useDispatch } from 'react-redux';
import { addRetries, addVideoFile, updateIsCompleted } from '../store/slices/userSlice';
import { RNCamera } from 'react-native-camera';
import { Swipeable } from 'react-native-gesture-handler';
import { colors, fontFamily, fontSizes } from '../constants/constants';

const Camera = forwardRef(({ route, navigation, question, isLastIndex }, ref) => {
    const redoRef = useRef(false)
    const swipeRef = useRef();
    const positionRef = useRef(new Animated.Value(0))
    const fontSize = useRef(new Animated.Value(45))
    const { width, height } = useWindowDimensions();
    const { link } = route.params;
    const isFocused = useIsFocused();
    const documentId = link.split('data=')[1];
    const dispatch = useDispatch()

    const [redoModalVisible, setRedoModalVisible] = useState(false)
    const [animatedViewHeight, setAnimatedViewHeight] = useState(0)
    const currentQuestionId = +route.name.split(' ')[1]

    // Disable Back Press
    useEffect(() => {
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress', backAction
        );
        return () => backHandler.remove();
    }, [])

    // Starts Animations
    useEffect(() => {
        positionRef.current.setValue(0)
        fontSize.current.setValue(50)

        // Text Animations
        Animated.timing(positionRef.current, {
            toValue: 1,
            duration: 1500,
            delay: 2500,
            useNativeDriver: true,
        }).start()

        Animated.timing(fontSize.current, {
            toValue: 26,
            duration: 1500,
            delay: 2500,
            useNativeDriver: false,
        }).start()
    }, [isFocused, redoModalVisible]);

    // Starts Recording After a second
    useEffect(() => {
        isFocused && setTimeout(() => startRecording(), 1000)
    }, [isFocused])

    // Translates Question Text From Center to Bottom With Ansimation
    const translateY = positionRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: [(height - animatedViewHeight) / 2, height - animatedViewHeight],
    });

    // Starts Recording Video
    const startRecording = async () => {
        try {
            const { uri } = await ref.current.recordAsync({
                orientation: "landscapeLeft",
                quality: RNCamera.Constants.VideoQuality['720p']
            });
            if (uri) {
                if (redoRef.current) {
                    redoRef.current = false;
                    dispatch(addRetries({
                        name: `${question}~4`,
                        uri,
                    }))
                    return setTimeout(startRecording, 1000)
                }

                dispatch(addVideoFile({
                    name: `${question}~2`,
                    uri,
                }))

                // Checks if The Questions are answered
                if (isLastIndex) {
                    dispatch(updateIsCompleted(true))
                    navigation.navigate('Upload', { documentId })
                } else {
                    navigation.navigate(`Camera ${currentQuestionId + 1}`)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Sets height of animated text
    const onLayout = ({ nativeEvent }) => {
        const heightOfView = nativeEvent.layout.height
        setAnimatedViewHeight(heightOfView)
    }

    // Listener on Swipe
    const onSwipeableOpen = (direction) => {
        if (direction === 'left') {
            swipeRef.current.close();
            setRedoModalVisible(true)
        } else {
            ref.current.stopRecording()
        }
    }

    {/* Camera View */ }
    if (isFocused) return (
        <Swipeable
            ref={swipeRef}
            onSwipeableOpen={onSwipeableOpen}
            renderLeftActions={() => <View style={{ width: width / 3 }} />}
            renderRightActions={() => <View style={{ width: width - 200 }} />}
        >
            <View style={{ width, height }}>

                {/* Animated Text */}
                {!redoModalVisible && <Animated.View style={[styles.question, { transform: [{ translateY }] }]} onLayout={onLayout}>
                    <Animated.Text style={[styles.questionText, { fontSize: fontSize.current }]}>{question}</Animated.Text>
                </Animated.View>}

                {/* Redo Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={redoModalVisible}>

                    <View style={[styles.modal, { height, width }]}>
                        <Text style={styles.redoText}>Redo Question</Text>
                        <View style={styles.icons}>
                            <MaterialCommunity name={'check'} size={80} color={colors.primary} onPress={async () => {
                                redoRef.current = true
                                setRedoModalVisible(false)
                            }} />
                            <Entypo name={'cross'} size={80} color={colors.primary} onPress={() => {
                                setRedoModalVisible(false)
                            }} />
                        </View>
                    </View>
                </Modal>

            </View>
        </Swipeable>
    )
})

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
    questionText: {
        color: 'white',
        textAlign: 'center',
        textShadowColor: colors.primary,
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 10,
        zIndex: 8,
        fontFamily: fontFamily.semiBold,
    },
    modal: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    redoText: {
        color: colors.primary,
        fontSize: fontSizes.large,
        fontFamily: fontFamily.semiBold,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '30%'
    }
});