import { StyleSheet, View, Linking, useWindowDimensions, Text } from 'react-native'
import React, { useRef } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'

const QRReader = ({ route, navigation }) => {
    const { setLink } = route.params;
    const { height, width } = useWindowDimensions()
    const ref = useRef()

    const onSuccess = ({ data }) => {
        const check = data.substring(0, 4);
        if (check === 'http') {
            setLink(data)
            Linking
                .openURL(data)
                .catch(err => console.error('An error occured', err));
        }
    }

    return (
        <View style={styles.page}>
            <QRCodeScanner
                reactivate={true}
                showMarker={true}
                markerStyle={styles.markerStyle}
                ref={ref}
                onRead={onSuccess}
                cameraStyle={{ width, height }}
            />
            <View style={{position: 'absolute',left:90}}>
            <Text style={styles.text}>SCAN</Text>
            <Text style={styles.text}>QR CODE</Text>
            </View>
        </View>
    )
}

export default QRReader

const styles = StyleSheet.create({
    page: {
        flex: 1,
        filter: 'grayscale(100%)',
        flexDirection:'row-reverse',
        alignItems:'center'
    },
    text: {
        fontSize: 50,
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgb(227, 89, 255)',
        textShadowOffset: { width: -5, height: -3 },
        textShadowRadius: 5,
    },
    markerStyle: {
        borderColor: 'rgb(227, 89, 255)',
        borderRadius: 15,
        borderWidth: 4,
        position: 'absolute',
        right:50
    }
})