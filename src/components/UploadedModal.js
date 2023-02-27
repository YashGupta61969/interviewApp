import { StyleSheet, Text, View, useWindowDimensions, Modal, ActivityIndicator, TouchableOpacity} from 'react-native'
import React from 'react'

const UploadedModal = ({ visible, setVisible, uploaded }) => {
    const { height, width } = useWindowDimensions();

    return (
        <Modal
            visible={visible}
            animationType={'fade'}
            onRequestClose={() => setVisible(false)}
            transparent={true}>

            <View style={{ ...styles.modal, height, width }}>
                <View style={styles.modal_content}>
                    {!uploaded && <><Text style={styles.uploadedText}>Uploading</Text>
                        <ActivityIndicator size={38} color='rgb(227, 89, 255)' /></>}
                </View>
            </View>
        </Modal>
    )
}

export default UploadedModal

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
    uploadedText:{
        color: 'black', 
        fontSize: 26, 
        marginBottom: 15,
        letterSpacing:1,
        fontFamily:'PTSansNarrow-Bold'
    }
})