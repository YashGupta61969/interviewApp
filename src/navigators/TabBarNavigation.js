import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import Camera from '../screens/Camera';
import Welcome from '../screens/Welcome';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateIsCompleted } from '../store/slices/userSlice';
import colors from '../constants/colors';

const Tab = createMaterialTopTabNavigator();

const TabBarNavigation = ({ route }) => {
    const {isCompleted} = useSelector(state=>state.user)
    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setLoading(true)
        firestore().collection('users').doc(documentId).get().then((res) => {

            if (res.data().questions.length) {
                const filteredArr = res.data().questions.filter(que => !que.answer)
                setQuestions(filteredArr)

                if(filteredArr){
                    dispatch(updateIsCompleted(false))
                }else{
                    dispatch(updateIsCompleted(true))
                }
            }
            setLoading(false)
        })
    }, [link])

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator backBehavior='none' screenOptions={{
                tabBarStyle: { display: 'none' },
                swipeEnabled: !isCompleted
            }}>
                <Tab.Screen name={`Welcome`} component={Welcome} initialParams={{ link }} />
                {
                    questions && questions.map(d => {
                        return <Tab.Screen name={`Camera${d.id}`} component={Camera} initialParams={{ link, questionId: d.id }} key={d.id} />
                    })
                }
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default TabBarNavigation