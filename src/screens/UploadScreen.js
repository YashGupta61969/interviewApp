import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { RNCamera } from 'react-native-camera'
import BackgroundService from 'react-native-background-actions';
import notifee from '@notifee/react-native';
import { addVideoFile, clearRetries, clearVideoFiles } from '../store/slices/userSlice'

const UploadScreen = ({ route }) => {

    const dispatch = useDispatch
    const { documentId, link } = route.params;
    const { videoFiles, retries } = useSelector(state => state.user)
    const { navigate } = useNavigation()
    const [channelId, setChannelId] = useState('')

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
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });
            setChannelId(channelId)
            await onDisplayNotification('Uploading Response', 'Your response is being uploaded')
            await BackgroundService.start(uploadVideos, options);
        })()
    }, [])

    const uploadVideos = async () => {
        try {
            const form = new FormData()
            const retryForm = new FormData()

            retries.forEach((vid) => {
                retryForm.append('video', {
                    uri: vid.uri,
                    type: 'video/mp4',
                    name: vid.name
                })
            })
            retryForm.append('documentId', documentId)

            videoFiles.forEach((vid) => {
                form.append('video', {
                    uri: vid.uri,
                    type: 'video/mp4',
                    name: vid.name
                })
            })
            form.append('documentId', documentId)

            const requestUrl = 'http://142.93.219.133/video-app/';
            const retryRequestUrl = 'http://142.93.219.133/video-app/retry';

            await fetchRequest(requestUrl, form)
            retries.length && await fetchRequest(retryRequestUrl, retryForm)

            await onDisplayNotification('Completed', 'Your response has been submitted')

            dispatch(clearVideoFiles())
            dispatch(clearRetries())
            await BackgroundService.stop();
            navigate('Welcome', { link: 'empty' })

        } catch (error) {
            console.log('error uploading', error)
        }
    }

    // Display a notification
    const onDisplayNotification = async (title, body) => {
        return notifee.displayNotification({
            title,
            body,
            android: {
                channelId,
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    const fetchRequest = async (url, data) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: data
            });
            return response.json()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <RNCamera
            style={styles.container}
            type='front'>
            <View style={styles.uploadModal}>
                <Text style={styles.text}>Uploading</Text>
                <Text style={[styles.text, styles.subText]}>Your Video Is Being Uploaded in Background</Text>
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