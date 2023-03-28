import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RNCamera } from 'react-native-camera'
import BackgroundService from 'react-native-background-actions';
import notifee from '@notifee/react-native'
import { clearRetries, clearVideoFiles } from '../store/slices/userSlice'

const UploadScreen = ({ route }) => {

    const dispatch = useDispatch()
    const { documentId } = route.params;
    const { videoFiles, retries } = useSelector(state => state.user)
    const [message, setMessage] = useState('Your Video Is Being Uploaded in Background')
    const [uploaded, setUploaded] = useState(false)

    const options = {
        taskName: 'Upload',
        taskTitle: 'Uploading Response',
        taskDesc: 'Uploading Your Response',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        linkingURI: 'https://interviewapptestyash.page.link/',
        color: '#ff00ff',
        parameters: {
            delay: 500,
        },
    };

    useEffect(() => {
        (async () => {
            try {
                await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                });

                await notifee.displayNotification({
                    title: 'Uploading',
                    body: 'Your Response Is Being Uploaded',
                    android: {
                        channelId: 'default',
                    },
                });
                await BackgroundService.start(uploadVideos, options);
            } catch (error) {
                setMessage(`Unknown Error ${error.message}`)
            }
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

            videoFiles.length && await fetchRequest(requestUrl, form);
            retries.length && await fetchRequest(retryRequestUrl, retryForm);
            setMessage('Your Response Is Uploaded')
            setUploaded(true)
            await notifee.cancelAllNotifications()

            dispatch(clearVideoFiles())
            dispatch(clearRetries())
            await BackgroundService.stop();
        } catch (error) {
            setMessage(`Upload function => ${error.message}`)
            console.log('background task error', error)
        }
    }

    const fetchRequest = (url, data) => {
        try {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: data
            });
        } catch (error) {
            console.log(error)
            setMessage(`Server Error ${error.message}`)
        }
    }

    return (
        <RNCamera
            style={styles.container}
            type='front'>
            <View style={styles.uploadModal}>
                <Text style={styles.text}>{uploaded ? 'Uploaded' : 'Uploading'}</Text>
                <Text style={[styles.text, styles.subText]}>{message}</Text>
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