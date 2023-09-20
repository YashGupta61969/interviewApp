import { StyleSheet, ActivityIndicator, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/constants'

const Loader = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({})