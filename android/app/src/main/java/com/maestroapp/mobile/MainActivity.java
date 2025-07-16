package com.maestroapp.mobile;

import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.Bridge;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    private CustomCordovaInterface cordova;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        this.cordova = new CustomCordovaInterface(this);
        super.onCreate(savedInstanceState);

        // Initializes the Bridge
        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
            // Additional plugins you've installed go here
            // Ex: add(TotallyAwesomePlugin.class);
        }});
        
        // Enable Web Bluetooth in WebView
        WebSettings settings = this.bridge.getWebView().getSettings();
        settings.setJavaScriptEnabled(true);
        
        // Allow mixed content for potential HTTP resources
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, android.content.Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        cordova.onActivityResult(requestCode, resultCode, data);
    }
}
