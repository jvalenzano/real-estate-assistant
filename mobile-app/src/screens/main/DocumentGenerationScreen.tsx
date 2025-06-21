import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  RadioButton,
  List,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import { MainStackScreenProps } from '../../navigation/types';

type Props = MainStackScreenProps<'DocumentGeneration'>;

type DocumentType = 'RPA' | 'CMA' | 'BuyerPresentation';

const DocumentGenerationScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { propertyId, propertyData } = route.params;
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>('RPA');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const documentTypes = [
    {
      value: 'RPA' as DocumentType,
      title: 'Residential Purchase Agreement',
      description: 'Standard purchase agreement for residential properties',
      icon: 'file-document-outline',
    },
    {
      value: 'CMA' as DocumentType,
      title: 'Comparative Market Analysis',
      description: 'Market analysis comparing similar properties',
      icon: 'chart-line',
    },
    {
      value: 'BuyerPresentation' as DocumentType,
      title: 'Buyer Presentation',
      description: 'Professional presentation for potential buyers',
      icon: 'presentation',
    },
  ];

  const handleGenerateDocument = async () => {
    setGenerating(true);
    setProgress(0);

    // Simulate document generation with progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(progressInterval);
          // Navigate to preview after generation
          setTimeout(() => {
            navigation.navigate('DocumentPreview', {
              documentId: 'mock-doc-id',
              documentType: selectedDocument,
              propertyId: propertyId,
            });
          }, 500);
          return 1;
        }
        return prev + 0.1;
      });
    }, 200);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.propertyCard}>
          <Card.Content>
            <Text variant="titleMedium">{propertyData.address}</Text>
            <Text variant="bodyLarge" style={styles.propertyInfo}>
              ${propertyData.price.toLocaleString()} • MLS: {propertyData.mlsNumber}
            </Text>
          </Card.Content>
        </Card>

        <Text variant="titleLarge" style={styles.sectionTitle}>
          Select Document Type
        </Text>

        <RadioButton.Group
          onValueChange={(value) => setSelectedDocument(value as DocumentType)}
          value={selectedDocument}
        >
          {documentTypes.map((doc) => (
            <Card
              key={doc.value}
              style={[
                styles.documentOption,
                selectedDocument === doc.value && styles.selectedOption,
              ]}
              onPress={() => setSelectedDocument(doc.value)}
            >
              <Card.Content>
                <List.Item
                  title={doc.title}
                  description={doc.description}
                  left={(props) => <List.Icon {...props} icon={doc.icon} />}
                  right={(props) => (
                    <RadioButton
                      value={doc.value}
                      status={
                        selectedDocument === doc.value ? 'checked' : 'unchecked'
                      }
                    />
                  )}
                />
              </Card.Content>
            </Card>
          ))}
        </RadioButton.Group>

        {generating && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.progressTitle}>
                Generating Document...
              </Text>
              <ProgressBar
                progress={progress}
                style={styles.progressBar}
              />
              <Text variant="bodyMedium" style={styles.progressText}>
                {Math.round(progress * 100)}% Complete
              </Text>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={handleGenerateDocument}
          loading={generating}
          disabled={generating}
          style={styles.generateButton}
          icon="file-plus"
        >
          {generating ? 'Generating...' : 'Generate Document'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={generating}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  propertyCard: {
    marginBottom: 24,
  },
  propertyInfo: {
    marginTop: 4,
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  documentOption: {
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#3F51B5',
    borderWidth: 2,
  },
  progressCard: {
    marginTop: 24,
    marginBottom: 16,
  },
  progressTitle: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  generateButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 32,
  },
});

export default DocumentGenerationScreen;