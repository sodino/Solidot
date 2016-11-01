package com.solidot.bridge;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Administrator on 2016/10/13.
 */

public class AppInfo extends ReactContextBaseJavaModule {
    public static final String VERSION_NAME = "versionName";
    public static final String VERSION_CODE = "versionCode";

    private ReactApplicationContext context;
    public AppInfo(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Override
    public String getName() {
        return "AppInfo";
    }

    @Override
    public @Nullable Map<String, Object> getConstants() {
        Log.d("AppInfo", "getConstants()");

        HashMap<String, Object> kvMap = new HashMap<>();

        PackageManager pm = context.getPackageManager();//context为当前Activity上下文
        PackageInfo pi = null;
        String name = "unknown";
        int code = 0;
        try {
            pi = pm.getPackageInfo(context.getPackageName(), 0);

            name = pi.versionName;
            code = pi.versionCode;

        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        kvMap.put(VERSION_NAME, name);
        kvMap.put(VERSION_CODE, code);

        return kvMap;
    }
}
