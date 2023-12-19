import { StyleSheet, Text, useWindowDimensions, View, TouchableOpacity, Animated, Easing, PermissionsAndroid, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSolo } from '../store/slices/userSlice';
import { colors, fontFamily, fontSizes } from '../constants/constants';
import Loader from '../components/Loader';

const Welcome = ({ route }) => {
    const isFocused = useIsFocused();
    const [opacity] = useState(new Animated.Value(1));
    const [firstPoleRotate] = useState(new Animated.Value(0));
    const [secondPoleRotate] = useState(new Animated.Value(0));
    const [firstPoleTranslate] = useState(new Animated.Value(0));
    const [secondPoleTranslate] = useState(new Animated.Value(0));

    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const { height, width } = useWindowDimensions();
    const { isSolo } = useSelector(state => state.user)
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
           Platform.OS === 'android' && requestPermission()
        }
    }, [isFocused, link]);

    const requestPermission = async () => {
        try {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        } catch (error) {
            console.log(error)
        }
    }

    const startAnimation = () => {
        setShowInfo(prev => !prev);

        if (!showInfo) {
            firstPoleRotate.setValue(0)
            secondPoleRotate.setValue(0)

            Animated.timing(
                firstPoleTranslate, {
                toValue: 11,
                duration: 250,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
            Animated.timing(
                secondPoleTranslate, {
                toValue: -11,
                duration: 250,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
            Animated.timing(
                firstPoleRotate, {
                toValue: 1,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();

            Animated.timing(
                secondPoleRotate, {
                toValue: 1,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
            Animated.timing(
                opacity,
                {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }
            ).start();
        } else {
            firstPoleRotate.setValue(1)
            secondPoleRotate.setValue(1)

            Animated.timing(
                firstPoleTranslate, {
                toValue: 0,
                duration: 250,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
            Animated.timing(
                secondPoleTranslate, {
                toValue: 0,
                duration: 250,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();

            Animated.timing(
                firstPoleRotate, {
                toValue: 0,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
            Animated.timing(
                secondPoleRotate, {
                toValue: 0,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
            Animated.timing(
                opacity,
                {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }
            ).start();
        }
    }

    const firstPoleSpin = firstPoleRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    const secondPoleSpin = secondPoleRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-45deg'],
    });

    if (loading) return <Loader />

    // Returns Camera Screen Option When Questions Are Available 
    return (
        <>
            <TouchableOpacity style={styles.infoIcon} activeOpacity={1} onPress={startAnimation}>
                <Animated.View style={[styles.infoIconBar, { top: 0, opacity, transform: [{ translateY: firstPoleTranslate }] }]} />
                <Animated.View style={[styles.infoIconBar, { top: 11, transform: [{ rotate: firstPoleSpin }] }]} />
                <Animated.View style={[styles.infoIconBar, { top: 11, transform: [{ rotate: secondPoleSpin }] }]} />
                <Animated.View style={[styles.infoIconBar, { top: 22, opacity, transform: [{ translateY: secondPoleTranslate }] }]} />
            </TouchableOpacity>

            {
                showInfo && <View style={[styles.mainContainer, { height, width }]}>
                    <View style={[styles.infoModal, { width }]}>
                        <Text style={styles.infoText}>1. PREPARE YOUR FRAMING TO BE RECORDED</Text>
                        <Text style={styles.infoText}>2. SWIPE &lt;--- TO ANSWER 1ST QUESTION</Text>
                        <Text style={styles.infoText}>3. SWIPE &lt;--- EACH TIME FOR NEXT QUESTION</Text>
                        <Text style={styles.infoText}>4. SWIPE ---&gt; TO REDO // TOUCH SCREEN TO PAUSE</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonLabel}>Select Mode</Text>
                        <View style={styles.buttonsWrapper}>
                            <TouchableOpacity style={[styles.button, isSolo && styles.active]} onPress={() => dispatch(setIsSolo(true))}>
                                <Text style={[styles.buttonText, !isSolo && { color: colors.primary }]}>SOLO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, !isSolo && styles.active]} onPress={() => dispatch(setIsSolo(false))}>
                                <Text style={[styles.buttonText, isSolo && { color: colors.primary }]}>COLLAB</Text>
                            </TouchableOpacity>
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15
    },
    welcomeText: {
        color: 'white',
        fontSize: 55,
        fontFamily: fontFamily.semiBold,
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: colors.primary,
        textShadowOffset: { width: -2.6, height: -2.6 },
        textShadowRadius: 1,
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
        borderRadius: 6,
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
        fontFamily: fontFamily.medium,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: -1, height: -1 },
        textShadowRadius: 5,
    },
    interviewCompleteText: {
        marginTop: 12,
        fontSize: fontSizes.small,
        paddingHorizontal: 10,
        color: 'white',
        fontFamily: fontFamily.medium,
        textShadowColor: colors.primary,
        textShadowOffset: { width: -2, height: -1 },
        textShadowRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 40
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
        fontSize: fontSizes.small,
        fontFamily: fontFamily.medium
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
        fontSize: fontSizes.extraSmall,
        fontFamily: fontFamily.medium,
    },
    active: {
        borderRadius: 20,
        backgroundColor: colors.primary
    }
})