import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import colors from '../constants/colors'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { RNCamera } from 'react-native-camera'

const UploadScreen = ({ route }) => {
    const { documentId } = route.params;
    const { videoFiles } = useSelector(state => state.user)
    const { navigate } = useNavigation()


    useEffect(() => {
        uploadVideos()
        // videoFiles.forEach((vid, index, arr) => {
        //     setTimeout(() => {
        //         uploadVideos(vid)
        //         if (index === arr.length - 1) {
        //             navigate('Welcome', { link: 'empty' })
        //         }
        //     }, 1000 * index)
        // })
    }, [])

    const uploadVideos = async () => {
        try {
            const form = new FormData()

            videoFiles.forEach((vid) => {
                form.append('video', {
                    uri: vid.uri,
                    type: 'video/mp4',
                    name: vid.name
                })
            })
            form.append('documentId', documentId)

            const requestUrl = 'http://142.93.219.133/video-app/';

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form
            });

            console.log(await response.json())
            navigate('Welcome', { link: 'empty' })

        } catch (error) {
            console.log('error uploading', error)
        }
    }

    return (
        <RNCamera
            style={styles.container}
            type='front'>
            <View style={styles.uploadModal}>
                <Text style={styles.text}>Uploading</Text>
                <Text style={[styles.text, styles.subText]}>Please Do Not Close The App.</Text>
                <ActivityIndicator color={colors.primary} size={'large'} />
            </View>
        </RNCamera>
    )
}

export default UploadScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        overflow: 'hidden'
    },
    uploadModal: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 20,
        borderColor: colors.primary,
        borderWidth: 1,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 30,
        marginBottom: 6,
        fontFamily: 'BarlowCondensed-Medium'
    },
    subText: {
        fontSize: 20,
        fontFamily: 'BarlowCondensed-Regular',
        marginBottom: 20,
        color: colors.grayText
    }
})