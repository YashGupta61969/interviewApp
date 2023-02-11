import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
import React, { useRef } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'

const QRReader = ({ setLink }) => {
    const ref = useRef()

    const onSuccess = (e) => {
        const check = e.data.substring(0, 4);
        if (check === 'http') {
            setLink(e.data)
            Linking
                .openURL(e.data)
                .catch(err => console.error('An error occured', err));
        }
    }

    return (
        <View style={styles.page}>
            <QRCodeScanner
                // reactivate={true}
                showMarker={true}
                ref={ref}
                onRead={onSuccess}
                topContent={
                    <Text style={styles.text}>Please Scan QR Code</Text>
                }
            />
        </View>
    )
}

export default QRReader

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'black'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600'
    }
})