import { Modal, StyleSheet, Text, useWindowDimensions, View, TouchableOpacity } from 'react-native'
import React from 'react'

const Modals = ({ modalVisible, setModalVisible, errorHead, errorDesc }) => {
    const { width, height } = useWindowDimensions();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>

            <View style={{ ...Styles.modal, height: height, width: width }}>
                <View style={Styles.modal_content}>
                    <Text style={{ ...Styles.modal_head }}>{errorHead}</Text>
                    {errorDesc && <Text style={Styles.modal_text}>{errorDesc}</Text>}

                    <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => {
                            setModalVisible(false);
                        }}>
                            <Text style={{ color: '#006ee6' }}>Okay</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => {
                            setModalVisible(false)
                        }}>
                            <Text style={{ color: '#006ee6' }}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default Modals

const Styles = StyleSheet.create({
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
        backgroundColor: '#c7c7c7',
        borderRadius: 8
    },
    modal_head: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 15
    },
    modal_text: {
        color: '#757575',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20
    }
})
