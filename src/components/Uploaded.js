import { StyleSheet, Text, View, useWindowDimensions, Modal, ActivityIndicator, TouchableOpacity} from 'react-native'
import React from 'react'

const Uploaded = ({ visible, setVisible, uploaded }) => {
    const { height, width } = useWindowDimensions();

    return (
        <Modal
            visible={visible}
            animationType={'fade'}
            onRequestClose={() => setVisible(false)}
            transparent={true}>

            <View style={{ ...styles.modal, height, width }}>
                <View style={styles.modal_content}>

                    {!uploaded && <><Text style={{ color: 'black', fontSize: 22, marginBottom: 15 }}>Uploading</Text>
                        <ActivityIndicator size={38} color='blue' /></>}

                    {
                        uploaded && <View>
                            <Text style={{ color: 'black', fontSize: 22, marginBottom: 15, textAlign: 'center' }}>Uploaded</Text>
                            <TouchableOpacity onPress={() => { setVisible(false) }} style={{ backgroundColor: 'blue', paddingVertical: 6, borderRadius: 8, width: 200 }}>
                                <Text style={{ fontSize: 18, textAlign: 'center', color: 'white' }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </View>
        </Modal>

    )
}

export default Uploaded

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        outline: 0,
    },
    modal_content: {
        width: 250,
        alignItems: 'center',
        paddingTop: 15,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'white',
        borderRadius: 8
    },

})