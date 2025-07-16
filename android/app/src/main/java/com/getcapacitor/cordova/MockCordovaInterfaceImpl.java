package com.getcapacitor.cordova;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

import org.apache.cordova.CordovaInterfaceImpl;
import org.apache.cordova.CordovaPlugin;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MockCordovaInterfaceImpl extends CordovaInterfaceImpl {
    private Activity activity;
    private ExecutorService threadPool;

    public MockCordovaInterfaceImpl(Activity activity) {
        super((activity instanceof AppCompatActivity) ? (AppCompatActivity)activity : null, Executors.newCachedThreadPool());
        this.activity = activity;
        this.threadPool = Executors.newCachedThreadPool();
    }

    @Override
    public void startActivityForResult(CordovaPlugin command, Intent intent, int requestCode) {
        activity.startActivityForResult(intent, requestCode);
    }

    @Override
    public Activity getActivity() {
        return activity;
    }

    @Override
    public ExecutorService getThreadPool() {
        return threadPool;
    }

    @Override
    public void setActivityResultCallback(CordovaPlugin plugin) {
        // Do nothing
    }
} 