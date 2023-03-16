import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import colors from '../constants/colors'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import BackgroundService from 'react-native-background-actions';
import { Camera, useCameraDevices } from 'react-native-vision-camera'

const UploadScreen = ({ route }) => {
    const { documentId, link } = route.params;
    const { videoFiles } = useSelector(state => state.user)
    const { navigate } = useNavigation()
    const device = useCameraDevices().front

    const options = {
        taskName: 'Upload',
        taskTitle: 'Uploading Response',
        taskDesc: 'Your Response Is Being Uploaded',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        linkingURI: link,
        color: colors.primary,
        parameters: {
            delay: 500,
        },
    };

    useEffect(() => {
        (async () => {
            await BackgroundService.start(uploadVideos, options);
        })()
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
            await BackgroundService.stop();
            navigate('Welcome', { link: 'empty' })

        } catch (error) {
            console.log('error uploading', error)
        }
    }

    if (!device) {
        return <Text>Why I See No Device LOL</Text>
    }

    return (
        <>
            <Camera
                style={{ flex: 1 }}
                device={device}
                isActive={true}
                onError={(er) => console.log('Error Loading Camera (Upload)', er)}
            />
            <View style={styles.container}>
                <View style={styles.uploadModal}>
                    <Text style={styles.text}>Uploading</Text>
                    <Text style={[styles.text, styles.subText]}>Your Video Is Being Uploaded in Background</Text>
                    {/* <ActivityIndicator color={colors.primary} size={'large'} /> */}
                </View>
            </View>
        </>
    )
}

export default UploadScreen

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
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