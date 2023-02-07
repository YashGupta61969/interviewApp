import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useRef } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { Easing, event, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { RNCamera } from 'react-native-camera'

const Welcome = () => {
    const ref = useRef();
    const {height} = useWindowDimensions()
    const translatedY = useSharedValue(0);

    const unlockGetureHandler = useAnimatedGestureHandler({
        onStart: () => { console.log('start') },
        onActive: (event) => {
            if(event.translationY < 1){
                translatedY.value = event.translationY;
            }
        },
        onEnd: (e) => {
            if(translatedY.value < -height / 2
             || e.velocityY < -500){
                translatedY.value = withTiming(-height,{duration:130, easing:Easing.linear})
            }else{
                translatedY.value = 0
            }
         }
    });

    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: withTiming(translatedY.value,{duration:20,easing:Easing.linear}) }
        ]
    }))
    return (
        <Animated.View style={[{flex:1},animatedContainerStyle]}>
            <PanGestureHandler onGestureEvent={unlockGetureHandler}>
                <Animated.View style={styles.container}>
                    <RNCamera
                        ref={ref}
                        style={{ ...styles.preview }}
                        type='front'>

                        <View style={styles.question}>
                            <Text style={{ fontSize: 20 }}>Welcome</Text>
                        </View>

                    </RNCamera>

                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
    },

    preview: {
        flex: 1,
        overflow: 'hidden'
    },
    question: {
        width: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 5,
        paddingVertical: 10
    },
})