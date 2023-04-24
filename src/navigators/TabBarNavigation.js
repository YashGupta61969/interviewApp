import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import firestore from '@react-native-firebase/firestore';
import { RNCamera } from 'react-native-camera';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import colors from '../constants/colors';
import Welcome from '../screens/Welcome';
import Camera from '../screens/Camera';
import { updateIsCompleted } from '../store/slices/userSlice';

const Tab = createMaterialTopTabNavigator();

const TabBarNavigation = ({ route }) => {
    const ref = useRef();
    const { isCompleted, isSolo } = useSelector(state => state.user)
    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        setLoading(true)
        firestore().collection('users').doc(documentId).get().then((res) => {
            setQuestions(res.data().questions)
            if (res.data().response || res.data().isffmpegProcessing) {
                dispatch(updateIsCompleted(true))
            } else {
                dispatch(updateIsCompleted(false))
            }
            setLoading(false)
        }).catch(err => console.log(err))
    }, [link])

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
    }

    return (
        <RNCamera
            ref={ref}
            style={{ width, height, overflow: 'hidden' }}
            type={isSolo ? 'front' : 'back'}>

            <Tab.Navigator backBehavior='none' screenOptions={{
                tabBarStyle: { display: 'none' },
                swipeEnabled: !isCompleted,
            }} sceneContainerStyle={{ backgroundColor: 'transparent' }}>
                <Tab.Screen name='Welcome' component={Welcome} initialParams={{ link }} />
                {
                    questions && questions.map((d, i, arr) => (
                        <Tab.Screen name={`Camera ${i}`} initialParams={{ link }} key={d.id}>
                            {props => <Camera {...props} ref={ref} question={d.value} isLastIndex={arr.length === i + 1} />}
                        </Tab.Screen>
                    ))
                }
            </Tab.Navigator>
        </RNCamera>
    )
}

export default TabBarNavigation