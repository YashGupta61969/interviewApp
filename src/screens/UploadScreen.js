import { StyleSheet, Text, View, useWindowDimensions, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RNCamera } from 'react-native-camera'
import BackgroundService from 'react-native-background-actions';
import { clearRetries, clearVideoFiles, updateIsCompleted } from '../store/slices/userSlice'

const UploadScreen = ({ route }) => {

    const dispatch = useDispatch()
    const { documentId } = route.params;
    const { videoFiles, retries } = useSelector(state => state.user)
    const [message, setMessage] = useState('Your Video Is Being Uploaded in Background')
    const [uploaded, setUploaded] = useState(false)
    const { height, width } = useWindowDimensions()

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
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress', backAction
        );
        return () => backHandler.remove();
    }, [])

    useEffect(() => {
        (async () => {
            try {
                dispatch(updateIsCompleted(false))
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
            
            form.append('documentId', documentId)
            retryForm.append('documentId', documentId)
            retries.forEach((vid) => {
                retryForm.append('video', {
                    uri: vid.uri,
                    type: 'video/mp4',
                    name: vid.name
                })
            })

            videoFiles.forEach((vid) => {
                form.append('video', {
                    uri: vid.uri,
                    type: 'video/mp4',
                    name: vid.name
                })
            })

            const requestUrl = 'http://142.93.219.133/video-app/';
            const retryRequestUrl = 'http://142.93.219.133/video-app/retry';

            videoFiles.length && await fetchRequest(requestUrl, form);
            retries.length && await fetchRequest(retryRequestUrl, retryForm);
            setMessage('Your Response Is Submitted')
            setUploaded(true)

            dispatch(clearVideoFiles())
            dispatch(clearRetries())
            await BackgroundService.stop();
        } catch (error) {
            setMessage(`Upload function => ${error.message}`)
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
            setMessage(`Server Error ${error.message}`)
        }
    }

    return (
        <RNCamera
            style={styles.container}
            type='front'>
            <View style={[styles.uploadModal, { width, height }]}>
                <Text style={styles.text}>{uploaded ? 'Completed' : 'Uploading'}</Text>
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
        // backgroundColor: 'black',
        overflow: 'hidden'
    },
    uploadModal: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 55,
        fontFamily: 'BarlowCondensed-SemiBold',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: colors.primary,
        textShadowOffset: { width: -3, height: -2 },
        textShadowRadius: 5,
        marginBottom: 3
    },
    subText: {
        fontSize: 25,
        fontFamily: 'BarlowCondensed-Regular',
        marginBottom: 20,
    }
})