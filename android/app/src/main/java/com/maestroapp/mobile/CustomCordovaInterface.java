package com.maestroapp.mobile;

import android.app.Activity;
import android.content.Intent;
import androidx.appcompat.app.AppCompatActivity;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CustomCordovaInterface implements CordovaInterface {
    private final Activity activity;
    private final ExecutorService threadPool;
    private CordovaPlugin activityResultCallback;
    private int activityResultRequestCode;

    public CustomCordovaInterface(Activity activity) {
        this.activity = activity;
        this.threadPool = Executors.newCachedThreadPool();
    }

    @Override
    public void startActivityForResult(CordovaPlugin command, Intent intent, int requestCode) {
        setActivityResultCallback(command);
        this.activityResultRequestCode = requestCode;
        activity.startActivityForResult(intent, requestCode);
    }

    @Override
    public void setActivityResultCallback(CordovaPlugin plugin) {
        this.activityResultCallback = plugin;
    }

    @Override
    public Activity getActivity() {
        return activity;
    }

    @Override
    public ExecutorService getThreadPool() {
        return threadPool;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (activityResultCallback != null && requestCode == activityResultRequestCode) {
            activityResultCallback.onActivityResult(requestCode, resultCode, intent);
        }
    }
} 