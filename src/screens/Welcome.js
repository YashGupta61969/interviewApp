import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import firestore from '@react-native-firebase/firestore';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RNCamera } from 'react-native-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useIsFocused } from '@react-navigation/native';

const Welcome = ({ route, navigation }) => {
    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const { height, width } = useWindowDimensions()
    const [showInfo, setShowInfo] = useState(false)
    const isFocused = useIsFocused()
    const swipeRef = useRef()

    const [data, setData] = useState({})

    useEffect(() => {
        firestore().collection('users').doc(documentId).get().then((res) => {
            const questionArray = Object.values(res.data().questions);

            const newArr = questionArray.filter(curr => {
                return !curr.answer
            })

            setData({ ...res.data(), questions: newArr })
        }).catch(err=>console.log(err))
    }, [isFocused]);

    const onSwipeableOpen = (d) => {
        swipeRef.current.close()
        navigation.navigate('Tabs')
    }
    // Returns Camera Screen Option When Questions Are Available 
    return (
        <>
            <Swipeable onSwipeableOpen={onSwipeableOpen}
                ref={swipeRef}
                renderRightActions={() => <Text>.</Text>}
                enabled={data && data.questions && data.questions.length >= 1}
            >
                {!showInfo && <MaterialIcons name='info-outline' color='rgb(227, 89, 255)' size={40} style={styles.infoIcon} onPress={() => setShowInfo(true)} />}

                {
                    showInfo && <View style={styles.infoModal}>
                        <MaterialIcons name='cancel' color='rgb(227, 89, 255)' size={40} style={styles.infoIcon} onPress={() => setShowInfo(false)} />
                        <Text style={styles.infoText}>1. PREPARE YOUR FRAMING TO BE RECORDED</Text>
                        <Text style={styles.infoText}>2. SWIPE &lt;--- TO ANSWER 1ST QUESTION</Text>
                        <Text style={styles.infoText}>3. SWIPE &lt;--- EACH TIME FOR NEXT QUESTION</Text>
                        <Text style={styles.infoText}>4. SIGN AND SWIPE &lt;--- TO SUBMIT</Text>
                        <Text style={styles.infoText}>5. SWIPE ---&gt; TO REDO // TOUCH SCREEN TO PAUSE</Text>
                    </View>
                }

                <RNCamera
                    style={{ width, height, overflow: 'hidden' }}
                    type='front'>
                    {
                        !showInfo && (link === 'empty' || !(data && Array.isArray(data.questions) && data.questions.length >= 1) ? <View style={styles.container}>
                            <Text style={styles.welcomeText}>WELCOME {data.name?.toUpperCase()}</Text>
                            <Text style={{ ...styles.welcomeText, marginTop: 20, fontSize: 19, paddingHorizontal: 10 }}>You Have Already Completed Your Interview</Text>
                        </View> : <View style={styles.container}>
                            <Text style={styles.welcomeText}>WELCOME</Text>
                            <Text style={styles.welcomeText}>{data.name?.toUpperCase()}</Text>
                        </View>)
                    }
                </RNCamera>
            </Swipeable>
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
        fontSize: 50,
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgb(227, 89, 255)',
        textShadowOffset: { width: -4, height: -2 },
        textShadowRadius: 5
    },
    btn: {
        paddingHorizontal: 15,
        paddingVertical: 2,
        borderRadius: 3,
        marginTop: 18,
        backgroundColor: 'green'
    },
    btnText: {
        fontSize: 23,
        fontWeight: '400',
        color: 'white',
    },
    infoIcon: {
        zIndex: 500,
        position: 'absolute',
        right: 10,
        top: 10
    },
    infoModal: {
        position: 'absolute',
        zIndex: 6000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoText: {
        color: 'rgb(237, 100, 255)',
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
    }
})