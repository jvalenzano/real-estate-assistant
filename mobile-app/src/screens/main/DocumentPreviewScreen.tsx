import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  FAB,
  Portal,
  Dialog,
  Paragraph,
  useTheme,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { MainStackScreenProps } from '../../navigation/types';

type Props = MainStackScreenProps<'DocumentPreview'>;

const { width: screenWidth } = Dimensions.get('window');

const DocumentPreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { documentId, documentType, propertyId } = route.params;
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // Simulate document loading
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleDownload = () => {
    // TODO: Implement actual download
    console.log('Downloading document:', documentId);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleEmail = () => {
    // TODO: Implement email functionality
    console.log('Emailing document:', documentId);
    setShowShareDialog(false);
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'RPA':
        return 'Residential Purchase Agreement';
      case 'CMA':
        return 'Comparative Market Analysis';
      case 'BuyerPresentation':
        return 'Buyer Presentation';
      default:
        return 'Document';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading document...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text variant="titleMedium" style={styles.toolbarTitle}>
          {getDocumentTitle()}
        </Text>
        <View style={styles.toolbarActions}>
          <IconButton icon="download" onPress={handleDownload} />
          <IconButton icon="share-variant" onPress={handleShare} />
        </View>
      </View>

      <ScrollView style={styles.documentContainer}>
        {/* Placeholder for PDF viewer */}
        <View style={styles.documentPlaceholder}>
          <Text variant="headlineMedium" style={styles.placeholderText}>
            Document Preview
          </Text>
          <Text variant="bodyLarge" style={styles.placeholderSubtext}>
            {getDocumentTitle()}
          </Text>
          <Text variant="bodyMedium" style={styles.placeholderInfo}>
            Document ID: {documentId}
          </Text>
          <Text variant="bodyMedium" style={styles.placeholderInfo}>
            Pages: 12
          </Text>
          
          <View style={styles.previewNote}>
            <Text variant="bodyMedium" style={styles.noteText}>
              Note: In production, this would display the actual PDF document
              using a PDF viewer component.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <FAB.Group
          open={fabOpen}
          icon={fabOpen ? 'close' : 'dots-vertical'}
          actions={[
            {
              icon: 'download',
              label: 'Download',
              onPress: handleDownload,
            },
            {
              icon: 'email',
              label: 'Email',
              onPress: () => setShowShareDialog(true),
            },
            {
              icon: 'printer',
              label: 'Print',
              onPress: () => console.log('Print'),
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          visible={true}
        />
      </Portal>

      <Portal>
        <Dialog
          visible={showShareDialog}
          onDismiss={() => setShowShareDialog(false)}
        >
          <Dialog.Title>Share Document</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Send this {getDocumentTitle()} via email?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowShareDialog(false)}>Cancel</Button>
            <Button onPress={handleEmail}>Send Email</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('PropertySearch')}
          style={styles.actionButton}
          icon="home"
        >
          Back to Search
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('DocumentGeneration', {
            propertyId,
            propertyData: {
              address: '123 Main St',
              price: 850000,
              mlsNumber: 'ML81234567',
            },
          })}
          style={styles.actionButton}
          icon="file-plus"
        >
          Generate Another
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarActions: {
    flexDirection: 'row',
  },
  documentContainer: {
    flex: 1,
  },
  documentPlaceholder: {
    margin: 16,
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    minHeight: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    marginBottom: 24,
    opacity: 0.7,
    textAlign: 'center',
  },
  placeholderInfo: {
    marginBottom: 8,
    opacity: 0.6,
  },
  previewNote: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  noteText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default DocumentPreviewScreen;