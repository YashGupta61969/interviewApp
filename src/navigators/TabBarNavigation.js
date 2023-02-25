import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import Camera from '../screens/Camera';
import Welcome from '../screens/Welcome';

const Tab = createMaterialTopTabNavigator();

const TabBarNavigation = ({ route }) => {
    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        firestore().collection('users').doc(documentId).get().then((res) => {

            if (res.data().questions) {
                setQuestions(res.data().questions.filter(que => !que.answer))
            }
            setLoading(false)
        })
    }, [link])

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator size={'large'} color={'rgb(227, 89, 255)'} />
        </View>
    }

    // Checks if all questions are answered or not
    const isSwipeEnabled = (direction) => {
        if (!questions) {
            return false
        } else if (direction === 'right') {
            // disable swiping from left to right
            return false;
        }
        return true;
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator backBehavior='none' screenOptions={{
                tabBarStyle: { display: 'none' },
                swipeEnabled: isSwipeEnabled
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