import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use different base URL for Android emulator and physical devices
// For physical devices, replace with your computer's IP address
const BASE_URL = Platform.select({
  ios: __DEV__ ? 'http://192.168.1.5:3001/api/v1' : 'https://api.realeagent.com/api/v1',
  android: __DEV__ ? 'http://192.168.1.5:3001/api/v1' : 'https://api.realeagent.com/api/v1',
  default: 'http://192.168.1.5:3001/api/v1',
});

const TOKEN_KEY = '@RealAgent:authToken';

// Log the base URL for debugging
console.log('API Base URL:', BASE_URL);

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error('API Error:', error.message);
    console.error('Error details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    if (error.response?.status === 401) {
      // Clear token on 401 error
      try {
        await AsyncStorage.removeItem(TOKEN_KEY);
      } catch (e) {
        console.error('Error removing auth token:', e);
      }
      
      // You can emit an event here to trigger logout in AuthContext
      // For now, we'll handle this in the auth service
    }
    return Promise.reject(error);
  }
);

export default api;
export { TOKEN_KEY };