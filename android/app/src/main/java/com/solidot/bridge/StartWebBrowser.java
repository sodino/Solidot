package com.solidot.bridge;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by Administrator on 2016/10/13.
 */

public class StartWebBrowser extends ReactContextBaseJavaModule {
    public StartWebBrowser(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "StartWebBrowser";
    }

    @ReactMethod
    public void start(String url) {
        Log.d("StartWebBrowser", "start:" + url);
        if (url == null || url.length() == 0) {
            return;
        }
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(Intent.ACTION_VIEW);
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.setData(Uri.parse(url));
        getCurrentActivity().startActivity(intent);
    }
}
