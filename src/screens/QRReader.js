import { StyleSheet, View, Linking, useWindowDimensions, Text } from 'react-native'
import React, { useRef } from 'react'
import { RNCamera } from 'react-native-camera';

const QRReader = () => {
    const { height, width } = useWindowDimensions()
    const ref = useRef()

    const onBarcodeDetected = (event) => {
        if (event.type === RNCamera.Constants.BarCodeType.qr) {
            const check = event.data.substring(0, 4);
            if (check === 'http') {
                Linking
                    .openURL(event.data)
                    .catch(err => console.error('An error occured', err));
            }
        }
    };

    return (
        <View style={styles.page}>
            <RNCamera
                ref={ref}
                onBarCodeRead={onBarcodeDetected}
                style={{...styles.cameraView, width, height}}>
                <View style={[styles.markerStyle, { width: width / 3 + 30, height: width / 3 + 30 }]} />

                <View style={{ position: 'absolute', right: 90, width:190 }}>
                    <Text style={styles.text}>SCAN</Text>
                    <Text style={styles.text}>QR CODE</Text>
                </View>
            </RNCamera>
        </View>
    )
}

export default QRReader

const styles = StyleSheet.create({
    page: {
        flex: 1,
        filter: 'grayscale(100%)',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    text: {
        fontSize: 50,
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgb(227, 89, 255)',
        textShadowOffset: { width: -5, height: -3 },
        textShadowRadius: 5,
        fontFamily:'BarlowCondensed-SemiBold',
    },
    cameraView:{
        overflow: 'hidden', 
        justifyContent: 'center'
    },
    markerStyle: {
        borderColor: 'rgb(227, 89, 255)',
        borderRadius: 15,
        borderWidth: 4,
        position: 'absolute',
        left: 50
    }
})