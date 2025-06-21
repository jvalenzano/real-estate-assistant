import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Divider,
  List,
  Chip,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { MainStackScreenProps } from '../../navigation/types';

type Props = MainStackScreenProps<'PropertyDetails'>;

interface PropertyDetails {
  id: string;
  mlsNumber: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  lotSize: string;
  description: string;
  features: string[];
  imageUrls: string[];
}

const PropertyDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { propertyId, mlsNumber } = route.params;
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyDetails | null>(null);

  useEffect(() => {
    // TODO: Fetch actual property details
    setTimeout(() => {
      setProperty({
        id: propertyId,
        mlsNumber: mlsNumber,
        address: '123 Main St, San Francisco, CA 94105',
        price: 850000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        yearBuilt: 2005,
        lotSize: '5,000 sqft',
        description: 'Beautiful single-family home in prime location.',
        features: ['Hardwood floors', 'Updated kitchen', 'Large backyard'],
        imageUrls: ['https://via.placeholder.com/400'],
      });
      setLoading(false);
    }, 1000);
  }, [propertyId, mlsNumber]);

  const handleGenerateDocument = () => {
    if (!property) return;
    
    navigation.navigate('DocumentGeneration', {
      propertyId: property.id,
      propertyData: {
        address: property.address,
        price: property.price,
        mlsNumber: property.mlsNumber,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text>Property not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: property.imageUrls[0] }}
        style={styles.headerImage}
      />
      
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.address}>
          {property.address}
        </Text>
        
        <Text variant="headlineSmall" style={styles.price}>
          ${property.price.toLocaleString()}
        </Text>
        
        <View style={styles.chips}>
          <Chip icon="bed">{property.bedrooms} beds</Chip>
          <Chip icon="shower">{property.bathrooms} baths</Chip>
          <Chip icon="home">{property.sqft.toLocaleString()} sqft</Chip>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <List.Item
              title="MLS Number"
              description={property.mlsNumber}
              left={(props) => <List.Icon {...props} icon="tag" />}
            />
            <Divider />
            <List.Item
              title="Year Built"
              description={property.yearBuilt.toString()}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
            <Divider />
            <List.Item
              title="Lot Size"
              description={property.lotSize}
              left={(props) => <List.Icon {...props} icon="ruler" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.descriptionCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Description
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {property.description}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.featuresCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Features
            </Text>
            {property.features.map((feature, index) => (
              <List.Item
                key={index}
                title={feature}
                left={(props) => <List.Icon {...props} icon="check" />}
              />
            ))}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleGenerateDocument}
          style={styles.generateButton}
          icon="file-document"
        >
          Generate Documents
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  address: {
    marginBottom: 8,
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  featuresCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
  },
  generateButton: {
    marginBottom: 32,
  },
});

export default PropertyDetailsScreen;