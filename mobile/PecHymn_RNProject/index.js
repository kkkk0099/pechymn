/** @format */

import {AppRegistry} from 'react-native';
import App from './src/navigation/App';
import {name as appName} from './app.json';

//Disable warning
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
