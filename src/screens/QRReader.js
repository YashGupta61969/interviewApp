import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native'
import React, { useRef } from 'react'
import { RNCamera } from 'react-native-camera'
import QRCodeScanner from 'react-native-qrcode-scanner'

const QRReader = () => {
    const ref = useRef()

    const onSuccess = (e) => {
        const check = e.data.substring(0, 4);
        if (check === 'http') {
            Linking
                .openURL(e.data)
                .catch(err => console.error('An error occured', err));
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <QRCodeScanner
                // reactivate={true}
                showMarker={true}
                ref={ref}
                onRead={onSuccess}
                topContent={
                    <Text style={{ textAlign: 'center' }}>
                        Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code to test.</Text>
                }
                bottomContent={
                    <View>
                        <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.scanner.reactivate()}>
                            <Text style={styles.buttonTextStyle}>OK. Got it!</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonTouchable}>
                            <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                        </TouchableOpacity>
                    </View>

                }
            />
        </View>
    )
}

export default QRReader

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'space-between'
    },

    captureBtn: {
        backgroundColor: 'red',
        width: '100%',
        borderRadius: 50
    },
    captureContainer: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    recordStartBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        borderColor: 'gray',
        alignSelf: 'center',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    recordingStopBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: 'white',
        borderWidth: 8,
        alignSelf: 'center',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})