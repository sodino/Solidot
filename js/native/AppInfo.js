import {
    NativeModules,
} from 'react-native';
var AppInfo = NativeModules.AppInfo;

module.exports = {
    getVersionName : function() {
        return AppInfo.versionName;
    },
    getVersionCode : function() {
        return AppInfo.versionCode;
    },
};