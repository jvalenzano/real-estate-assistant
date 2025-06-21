import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';
import PropertySearchScreen from '../screens/main/PropertySearchScreen';
import PropertyDetailsScreen from '../screens/main/PropertyDetailsScreen';
import DocumentGenerationScreen from '../screens/main/DocumentGenerationScreen';
import DocumentPreviewScreen from '../screens/main/DocumentPreviewScreen';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="PropertySearch"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3F51B5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Stack.Screen
        name="PropertySearch"
        component={PropertySearchScreen}
        options={{
          title: 'Property Search',
        }}
      />
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetailsScreen}
        options={{
          title: 'Property Details',
        }}
      />
      <Stack.Screen
        name="DocumentGeneration"
        component={DocumentGenerationScreen}
        options={{
          title: 'Generate Document',
        }}
      />
      <Stack.Screen
        name="DocumentPreview"
        component={DocumentPreviewScreen}
        options={{
          title: 'Document Preview',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;