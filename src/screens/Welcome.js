import { StyleSheet, Text, useWindowDimensions, View, ActivityIndicator, TouchableOpacity, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import colors from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { setIsColorful, setIsSolo } from '../store/slices/userSlice';

const Welcome = ({ route }) => {
    const isFocused = useIsFocused()
    const [firstPoldRotate] = useState(new Animated.Value(0))
    const [secondPoleRotate] = useState(new Animated.Value(0))
    const [firstPoleTranslate] = useState(new Animated.Value(0));
    const [secondPoleTranslate] = useState(new Animated.Value(0));
    const [opacity] = useState(new Animated.Value(1));

    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const { height, width } = useWindowDimensions();
    const { isSolo, isColorful } = useSelector(state => state.user)
    const dispatch = useDispatch();

    const [showInfo, setShowInfo] = useState(false)
    const [data, setData] = useState({})
    const [areQuestionsAvailable, setAreQuestionsAvailable] = useState(true)
    const [loading, setLoading] = useState(false)

    const welcomeMessage = link === 'empty ' ? 'Thank You' : `WELCOME ${data.name?.toUpperCase()}`;

    // Will Remove this useEffect and get The data from tab navigator as a route.params
    useEffect(() => {
        if (isFocused) {
            setLoading(true)
            setTimeout(startAnimation, 2000)
            firestore().collection('users').doc(documentId).get().then((res) => {
                setData(res.data())
                if (res.data().response || res.data().isffmpegProcessing) {
                    setAreQuestionsAvailable(false)
                } else {
                    setAreQuestionsAvailable(true)
                }
            }).catch(err => console.log(err)).finally(() => setLoading(false))
            notifee.requestPermission();
        }
    }, [isFocused, link]);

    const startAnimation = () => {
        setShowInfo(prev => !prev);

        if (!showInfo) {
            firstPoldRotate.setValue(0)
            secondPoleRotate.setValue(0)
            opacity.setValue(1)

            Animated.timing(
                firstPoleTranslate,
                {
                    toValue: 14,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }
            ).start();
            Animated.timing(
                secondPoleTranslate,
                {
                    toValue: -14,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }
            ).start();
            Animated.timing(
                firstPoldRotate,
                {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }
            ).start();

            Animated.timing(
                secondPoleRotate,
                {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }
            ).start();
            Animated.timing(
                opacity,
                {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }
            ).start();
        } else {
            firstPoldRotate.setValue(1)
            secondPoleRotate.setValue(1)
            opacity.setValue(0)

            Animated.timing(
                firstPoleTranslate,
                {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }
            ).start();
            Animated.timing(
                secondPoleTranslate,
                {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }
            ).start();

            Animated.timing(
                firstPoldRotate,
                {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }
            ).start();
            Animated.timing(
                secondPoleRotate,
                {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }
            ).start();
            Animated.timing(
                opacity,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }
            ).start();
        }
    }

    const firstPoleSpin = firstPoldRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    const secondPoleSpin = secondPoleRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-45deg'],
    });

    if (loading) {
        return <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
    }

    // Returns Camera Screen Option When Questions Are Available 
    return (
        <>
            <TouchableOpacity style={styles.infoIcon} activeOpacity={1} onPress={startAnimation}>
                <Animated.View style={[styles.infoIconBar, { top: 0, transform: [{ rotate: firstPoleSpin }, { translateY: firstPoleTranslate }] }]} />
                <Animated.View style={[styles.infoIconBar, { top: 11, opacity }]} />
                <Animated.View style={[styles.infoIconBar, { top: 22, transform: [{ rotate: secondPoleSpin }, { translateY: secondPoleTranslate }] }]} />
            </TouchableOpacity>

            {
                showInfo && <View style={[styles.mainContainer, { height, width }]}>
                    <View style={[styles.infoModal, { width }]}>
                        <Text style={styles.infoText}>1. PREPARE YOUR FRAMING TO BE RECORDED</Text>
                        <Text style={styles.infoText}>2. SWIPE &lt;--- TO ANSWER 1ST QUESTION</Text>
                        <Text style={styles.infoText}>3. SWIPE &lt;--- EACH TIME FOR NEXT QUESTION</Text>
                        <Text style={styles.infoText}>4. SWIPE ---&gt; TO REDO // TOUCH SCREEN TO PAUSE</Text>
                    </View>

                    <View style={styles.buttons}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.buttonLabel}>Select Mode</Text>
                            <View style={styles.buttonsWrapper}>
                                <TouchableOpacity style={[styles.button, isSolo && styles.active]} onPress={() => dispatch(setIsSolo(true))}>
                                    <Text style={styles.buttonText}>Solo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, !isSolo && styles.active]} onPress={() => dispatch(setIsSolo(false))}>
                                    <Text style={styles.buttonText}>Collab</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Text style={[styles.buttonLabel]}>Select Theme</Text>
                            <View style={styles.buttonsWrapper}>
                                <TouchableOpacity style={[styles.button, isColorful && styles.active]} onPress={() => dispatch(setIsColorful(true))}>
                                    <Text style={styles.buttonText}>Colorful</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, !isColorful && styles.active]} onPress={() => dispatch(setIsColorful(false))}>
                                    <Text style={styles.buttonText}>Black & White</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            }

            <View style={{ width, height, backgroundColor: 'transparent' }}>
                {
                    !showInfo && (link === 'empty' || !areQuestionsAvailable ? <View style={styles.container}>
                        <Text style={styles.welcomeText}>{welcomeMessage}</Text>
                        <Text style={styles.interviewCompleteText}>You Have Completed Your Interview</Text>
                    </View> : <View style={styles.container}>
                        <Text style={styles.welcomeText}>WELCOME</Text>
                        <Text style={styles.welcomeText}>{data.name?.toUpperCase()}</Text>
                    </View>)
                }
            </View>
        </>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        paddingVertical: 15
    },
    welcomeText: {
        color: 'white',
        fontSize: 55,
        fontFamily: 'BarlowCondensed-SemiBold',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: colors.primary,
        textShadowOffset: { width: -3, height: -2 },
        textShadowRadius: 5,
    },
    infoIcon: {
        zIndex: 500,
        position: 'absolute',
        right: 20,
        top: 10,
        gap: 6,
        marginTop: 10,
        minHeight: 50,
        minWidth: 50
    },
    infoIconBar: {
        backgroundColor: colors.primary,
        width: 40, 
        height: 5,
        borderRadius:6,
        position: 'absolute',
        right: 5,
    },
    infoModal: {
        alignItems: 'center',
    },
    infoText: {
        color: colors.primary,
        fontSize: 32,
        textAlign: 'center',
        fontFamily: 'BarlowCondensed-Medium',
    },
    interviewCompleteText: {
        marginTop: 12,
        fontSize: 22,
        paddingHorizontal: 10,
        color: 'white',
        fontFamily: 'BarlowCondensed-Medium',
        textShadowColor: colors.primary,
        textShadowOffset: { width: -2, height: -1 },
        textShadowRadius: 5,
    },
    buttons:{
        gap: 20, 
        alignItems: 'center', 
        marginTop: 35
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    buttonsWrapper: {
        flexDirection: 'row',
        borderRadius: 20,
        marginLeft: 20,
        borderColor: colors.primary,
        borderWidth: 1
    },
    buttonLabel: {
        color: colors.primary,
        fontSize: 30,
        fontFamily: 'BarlowCondensed-Medium'
    },
    button: {
        paddingVertical: 5,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 500,
        fontSize: 20,
        fontFamily: 'BarlowCondensed-Medium',
    },
    active: {
        borderRadius: 20,
        backgroundColor: colors.primary
    }
})