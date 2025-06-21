import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import { AuthStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Clear previous error
    setError('');
    setShowError(false);

    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setShowError(true);
      return;
    }

    setLoading(true);
    
    try {
      await login({ email, password });
      // Navigation will be handled automatically by RootNavigator
      // when authentication state changes
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome to REALeAgent
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue
          </Text>
          
          <Text variant="bodySmall" style={styles.demoText}>
            Demo: agent@demo.com / demo123
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) {
                setError('');
                setShowError(false);
              }
            }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            error={showError && !validateEmail(email) && email !== ''}
            disabled={loading}
          />
          {email !== '' && !validateEmail(email) && (
            <HelperText type="error" visible={true} style={styles.helperText}>
              Please enter a valid email address
            </HelperText>
          )}

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) {
                setError('');
                setShowError(false);
              }
            }}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              />
            }
            disabled={loading}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !email || !password}
            style={styles.button}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.linkButton}
          >
            Don't have an account? Sign Up
          </Button>
        </Surface>
      </ScrollView>
      
      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}
        action={{
          label: 'Dismiss',
          onPress: () => setShowError(false),
        }}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  linkButton: {
    marginTop: 8,
  },
  helperText: {
    marginTop: -12,
    marginBottom: 8,
  },
  snackbar: {
    backgroundColor: '#B00020',
  },
  demoText: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});

export default LoginScreen;