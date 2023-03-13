import { Animated } from 'react-native'
import React, { useEffect, useState } from 'react'

const useAnimate = (type, isFocused) => {
    const [position] = useState(new Animated.Value(0));
    const [fontSize] = useState(new Animated.Value(45));

    useEffect(() => {
        position.setValue(0)
        fontSize.setValue(50)

        // Text Animations
        Animated.timing(position, {
            toValue: 1,
            duration: 1500,
            delay: 2500,
            useNativeDriver: true,
        }).start()

        Animated.timing(fontSize, {
            toValue: 26,
            duration: 1500,
            delay: 2500,
            useNativeDriver: false,
        }).start()

    }, [isFocused])

    // Translates Question Text From Center to Bottom With Ansimation
    const translateY = position.interpolate({
        inputRange: [0, 1],
        outputRange: [(height - animatedViewHeight) / 2, height - animatedViewHeight],
        // extrapolate: "extend",
    });

    if (type === 'translate') {
        return { translateY, }
    } else if (type === 'scale') {
        return
    }
}

export default useAnimate