/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App.js';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import notifee from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {

        // Remove the notification
        await notifee.cancelNotification(notification.id);
    }
});

AppRegistry.registerComponent(appName, () => App);
