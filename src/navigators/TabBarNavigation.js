import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import Camera from '../screens/Camera';

const Tab = createMaterialTopTabNavigator();

const TabBarNavigation = ({ route }) => {

    const { link } = route.params;
    const documentId = link.split('data=')[1];
    const [data, setData] = useState({})

    useEffect(() => {
        firestore().collection('users').doc(documentId).get().then((res) => {
            setData(res.data())
        })
    }, [])

    if (!data || !data.questions) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={'rgb(227, 89, 255)'} />
        </View>
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <Tab.Navigator backBehavior='none' screenOptions={{
                tabBarStyle: { display: 'none' },
                swipeEnabled: false
            }}>
                {
                    Object.values(data.questions).filter(fil => !fil.answer).map(d => {
                        return <Tab.Screen name={`Camera${d.id}`} component={Camera} initialParams={{ link, questionId: d.id }} key={d.id} />
                    })
                }
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default TabBarNavigation