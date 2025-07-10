// Bluetooth compatibility layer for Capacitor Android app
import { Capacitor } from '@capacitor/core';

export const isCapacitorApp = () => {
  return Capacitor.isNativePlatform();
};

export const initializeBluetoothCompat = () => {
  if (isCapacitorApp()) {
    // For Capacitor Android app, Web Bluetooth should work natively
    // but we may need to request permissions
    console.log('Running in Capacitor Android app');
    
    // Check if Web Bluetooth is available
    if (!navigator.bluetooth) {
      console.error('Web Bluetooth API is not available in this environment');
      alert('Bluetooth is not available. Please ensure Bluetooth permissions are granted.');
    }
  } else {
    // Running in regular web browser
    console.log('Running in web browser');
    
    // Check Web Bluetooth support
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth API is not supported in this browser');
    }
  }
};

// Wrapper function for requesting Bluetooth device
export const requestBluetoothDevice = async (options) => {
  try {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth API is not available');
    }
    
    // Request the device
    const device = await navigator.bluetooth.requestDevice(options);
    return device;
  } catch (error) {
    console.error('Bluetooth device request failed:', error);
    throw error;
  }
}; 