import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Searchbar,
  Card,
  Text,
  Button,
  Chip,
  useTheme,
} from 'react-native-paper';
import { MainStackScreenProps } from '../../navigation/types';

type Props = MainStackScreenProps<'PropertySearch'>;

interface Property {
  id: string;
  mlsNumber: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl?: string;
}

const PropertySearchScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const handleSearch = () => {
    // TODO: Implement actual property search
    console.log('Searching for:', searchQuery);
    // Mock data for now
    setProperties([
      {
        id: '1',
        mlsNumber: 'ML81234567',
        address: '123 Main St, San Francisco, CA 94105',
        price: 850000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Refresh property list
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('PropertyDetails', {
          propertyId: item.id,
          mlsNumber: item.mlsNumber,
        })
      }
    >
      <Card.Cover
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/300' }}
        style={styles.cardImage}
      />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" numberOfLines={1}>
          {item.address}
        </Text>
        <Text variant="headlineSmall" style={styles.price}>
          ${item.price.toLocaleString()}
        </Text>
        <View style={styles.propertyDetails}>
          <Chip compact>{item.bedrooms} beds</Chip>
          <Chip compact>{item.bathrooms} baths</Chip>
          <Chip compact>{item.sqft.toLocaleString()} sqft</Chip>
        </View>
        <Text variant="bodySmall" style={styles.mlsNumber}>
          MLS: {item.mlsNumber}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by MLS number or address"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}
        >
          Search
        </Button>
      </View>

      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              {searchQuery
                ? 'No properties found'
                : 'Enter an MLS number or address to search'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchbar: {
    marginBottom: 8,
  },
  searchButton: {
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardImage: {
    height: 200,
  },
  cardContent: {
    paddingTop: 12,
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  propertyDetails: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  mlsNumber: {
    opacity: 0.7,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default PropertySearchScreen;