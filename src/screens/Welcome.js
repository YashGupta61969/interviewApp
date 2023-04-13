import { StyleSheet, Text, useWindowDimensions, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useIsFocused } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import colors from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSolo } from '../store/slices/userSlice';

const Welcome = ({ route }) => {
    const isFocused = useIsFocused()
    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const { height, width } = useWindowDimensions();
    const {isSolo} = useSelector(state=>state.user)
    const dispatch  = useDispatch();

    const [showInfo, setShowInfo] = useState(false)
    const [data, setData] = useState({})
    const [areQuestionsAvailable, setAreQuestionsAvailable] = useState(true)
    const [loading, setLoading] = useState(false)
    const welcomeMessage = link === 'empty ' ? 'Thank You' : `WELCOME ${data.name?.toUpperCase()}`;

    // Will Remove this useEffect and get The data from tab navigator as a route.params
    useEffect(() => {
        if (isFocused) {
            setLoading(true)
            setTimeout(() => setShowInfo(true), 2000)
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

    if (loading) {
        return <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
    }

    // Returns Camera Screen Option When Questions Are Available 
    return (
        <>
            {!showInfo && <MaterialIcons name='menu' color={colors.primary} size={40} style={styles.infoIcon} onPress={() => setShowInfo(true)} />}

            {
                showInfo && <View style={{ width, height, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'space-between', paddingVertical: 15 }}>
                    <View style={[styles.infoModal, { width }]}>
                        <MaterialIcons name='cancel' color={colors.primary} size={40} style={styles.infoIcon} onPress={() => setShowInfo(false)} />
                        <Text style={styles.infoText}>1. PREPARE YOUR FRAMING TO BE RECORDED</Text>
                        <Text style={styles.infoText}>2. SWIPE &lt;--- TO ANSWER 1ST QUESTION</Text>
                        <Text style={styles.infoText}>3. SWIPE &lt;--- EACH TIME FOR NEXT QUESTION</Text>
                        <Text style={styles.infoText}>4. SIGN AND SWIPE &lt;--- TO SUBMIT</Text>
                        <Text style={styles.infoText}>5. SWIPE ---&gt; TO REDO // TOUCH SCREEN TO PAUSE</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Text style={{ color: colors.primary, fontSize: 30, fontFamily: 'BarlowCondensed-Medium'}}>Select Mode</Text>
                        <View style={styles.buttonsWrapper}>
                            <TouchableOpacity style={[styles.button, isSolo && styles.active]} onPress={() => dispatch(setIsSolo(true))}>
                                <Text style={styles.buttonText}>Solo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, !isSolo && styles.active]} onPress={() => dispatch(setIsSolo(false))}>
                                <Text style={styles.buttonText}>Collab</Text>
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
        top: 10
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
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    buttonsWrapper: {
        flexDirection: 'row',
        marginTop: 5,
        borderRadius: 20,
        borderColor: colors.primary,
        borderWidth: 1
    },
    button: {
        paddingVertical: 5,
        width: 100,
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