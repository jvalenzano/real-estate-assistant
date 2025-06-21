import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DebugScreen: React.FC = () => {
  const { isAuthenticated, token } = useAuth();

  const testAPI = async () => {
    try {
      console.log('Testing API connection...');
      const response = await api.get('/health');
      console.log('API Health Response:', response.data);
      alert('API Connected Successfully!');
    } catch (error) {
      console.error('API Test Failed:', error);
      alert('API Connection Failed - Check console');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Auth Status:</Text>
        <Text style={styles.value}>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Token Exists:</Text>
        <Text style={styles.value}>{token ? 'Yes' : 'No'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>API Base URL:</Text>
        <Text style={styles.value}>http://192.168.1.5:3001/api/v1</Text>
      </View>
      
      <Button title="Test API Connection" onPress={testAPI} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
});

export default DebugScreen;