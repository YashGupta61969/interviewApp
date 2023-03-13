import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import colors from '../constants/colors'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const UploadScreen = ({ route }) => {
    const { documentId } = route.params;
    const { videoFiles } = useSelector(state => state.user)
    const { navigate } = useNavigation()

    useEffect(() => {
        videoFiles.forEach((vid, index, arr) => {
            setTimeout(() => {
                console.log(index, arr.length)
                uploadVideos(vid)
                if (index === arr.length - 1) {
                    navigate('Welcome', { link: 'empty' })
                }
            }, 1000 * index)
        })
    }, [])

    const uploadVideos = async (vid) => {
        try {
            const form = new FormData()
            form.append('video', {
                uri: vid.uri,
                type: 'video/mp4',
                name: vid.name
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

            console.log(await response.json(), vid.name)

        } catch (error) {
            console.log('error uploading', error)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.uploadModal}>
                <Text style={styles.text}>Uploading</Text>
                <Text style={[styles.text, styles.subText]}>Please Do Not Close The App.</Text>
                <ActivityIndicator color={colors.primary} size={'large'} />
            </View>
        </View>
    )
}

export default UploadScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
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