import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// Main navigation stacks
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  MainStack: NavigatorScreenParams<MainStackParamList>;
};

// Authentication stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main app stack
export type MainStackParamList = {
  PropertySearch: undefined;
  PropertyDetails: {
    propertyId: string;
    mlsNumber: string;
  };
  DocumentGeneration: {
    propertyId: string;
    propertyData: {
      address: string;
      price: number;
      mlsNumber: string;
    };
  };
  DocumentPreview: {
    documentId: string;
    documentType: 'RPA' | 'CMA' | 'BuyerPresentation';
    propertyId: string;
  };
};

// Screen prop types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  StackScreenProps<MainStackParamList, T>;