import { StyleSheet, Text, useWindowDimensions, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { RNCamera } from 'react-native-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useIsFocused } from '@react-navigation/native';
import colors from '../constants/colors';

const Welcome = ({ route }) => {
    const isFocused = useIsFocused()
    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const { height, width } = useWindowDimensions();
    
    const [showInfo, setShowInfo] = useState(false)
    const [data, setData] = useState({})
    const [areQuestionsAvailable, setAreQuestionsAvailable ] = useState(true)
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        if(isFocused){
            setLoading(true)
            firestore().collection('users').doc(documentId).get().then((res) => {
                const questions = res.data().questions.filter(que=>!que.answer);
                
                setData(res.data())
                if(questions.length){
                    setAreQuestionsAvailable(true)
                }
                
            }).catch(err => console.log(err)).finally(()=>setLoading(false))
        }
    }, [isFocused, link]);

    if (loading) {
        return <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={'large'} color={colors.primary}/>
        </View>
      }
      
      const welcomeMessage = link === 'empty' ? 'Thank You' : `WELCOME ${data.name?.toUpperCase()}`;
    // Returns Camera Screen Option When Questions Are Available 
    return (
        <>
            {!showInfo && <MaterialIcons name='menu' color={colors.primary} size={40} style={styles.infoIcon} onPress={() => setShowInfo(true)} />}

            {
                showInfo && <View style={styles.infoModal}>
                    <MaterialIcons name='cancel' color={colors.primary} size={40} style={styles.infoIcon} onPress={() => setShowInfo(false)} />
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
                    !showInfo && (link === 'empty' || !areQuestionsAvailable  ? <View style={styles.container}>
                        <Text style={styles.welcomeText}>{welcomeMessage}</Text>
                        <Text style={styles.interviewCompleteText}>You Have Completed Your Interview</Text>
                    </View> : <View style={styles.container}>
                        <Text style={styles.welcomeText}>WELCOME</Text>
                        <Text style={styles.welcomeText}>{data.name?.toUpperCase()}</Text>
                    </View>)
                }
            </RNCamera>
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
        fontFamily:'BarlowCondensed-SemiBold',
        textAlign: 'center',
        letterSpacing:2,
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
        color: colors.primary,
        fontSize: 35,
        textAlign: 'center',
        fontFamily:'BarlowCondensed-Medium',
    },
    interviewCompleteText:{
        marginTop: 12, 
        fontSize: 22, 
        paddingHorizontal: 10,
        color:'white',
        fontFamily:'BarlowCondensed-Medium',
        textShadowColor: colors.primary,
        textShadowOffset: { width: -2, height: -1 },
        textShadowRadius: 5,
    }
})