// lib/mock-data.ts

export interface Property {
  id: string;
  mlsNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  images: string[]; // Multiple images per property
  description: string;
  yearBuilt: number;
  lotSize: string;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family';
  status: 'Active' | 'Pending' | 'In Escrow' | 'Sold';
  listingDate: string;
  features: string[];
}

export const mockProperties: Property[] = [
  {
    id: '1',
    mlsNumber: 'ML81967654',
    address: '1234 Market St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    price: 1495000,
    beds: 2,
    baths: 2,
    sqft: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop'
    ],
    description: 'Modern condo in the heart of SOMA with stunning city views. Features include hardwood floors, stainless steel appliances, in-unit laundry, and a private balcony. Building amenities include 24/7 concierge, gym, and rooftop deck.',
    yearBuilt: 2018,
    lotSize: 'N/A',
    propertyType: 'Condo',
    status: 'Active',
    listingDate: '2024-01-15',
    features: ['Hardwood Floors', 'Stainless Steel Appliances', 'In-Unit Laundry', 'Balcony', 'Concierge', 'Gym', 'Rooftop Deck']
  },
  {
    id: '2',
    mlsNumber: 'ML81967655',
    address: '456 Valencia St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94110',
    price: 2250000,
    beds: 3,
    baths: 2.5,
    sqft: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2000&auto=format&fit=crop'
    ],
    description: 'Beautifully renovated Victorian home in the Mission District. Original architectural details preserved with modern updates throughout. Features a chef\'s kitchen, spa-like bathrooms, and a landscaped backyard perfect for entertaining.',
    yearBuilt: 1905,
    lotSize: '2,500 sqft',
    propertyType: 'Single Family',
    status: 'Pending',
    listingDate: '2024-01-10',
    features: ['Updated Kitchen', 'Original Details', 'Backyard', 'Parking', 'Storage', 'High Ceilings']
  },
  {
    id: '3',
    mlsNumber: 'ML81967656',
    address: '789 Ocean View Dr',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94132',
    price: 1875000,
    beds: 4,
    baths: 3,
    sqft: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=2000&auto=format&fit=crop'
    ],
    description: 'Spacious family home with panoramic ocean views. Recently updated with new roof, windows, and systems. Open floor plan perfect for modern living. Master suite with ocean views, walk-in closet, and luxurious bathroom.',
    yearBuilt: 1965,
    lotSize: '4,000 sqft',
    propertyType: 'Single Family',
    status: 'In Escrow',
    listingDate: '2023-12-20',
    features: ['Ocean Views', 'Updated Systems', 'Open Floor Plan', 'Master Suite', 'Garage', 'Storage']
  },
  {
    id: '4',
    mlsNumber: 'ML81967657',
    address: '321 Haight St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94117',
    price: 999000,
    beds: 1,
    baths: 1,
    sqft: 850,
    imageUrl: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472556-e636c2acda88?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2000&auto=format&fit=crop'
    ],
    description: 'Charming condo in the iconic Haight-Ashbury neighborhood. Walking distance to Golden Gate Park, cafes, and shops. Features include exposed brick, high ceilings, and abundant natural light.',
    yearBuilt: 1920,
    lotSize: 'N/A',
    propertyType: 'Condo',
    status: 'Active',
    listingDate: '2024-01-18',
    features: ['Exposed Brick', 'High Ceilings', 'Natural Light', 'Walk to Park', 'Public Transit']
  },
  {
    id: '5',
    mlsNumber: 'ML81967658',
    address: '555 Nob Hill Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94108',
    price: 3500000,
    beds: 3,
    baths: 3.5,
    sqft: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2000&auto=format&fit=crop'
    ],
    description: 'Luxury penthouse with breathtaking city and bay views. Designer finishes throughout including marble bathrooms, custom millwork, and chef\'s kitchen. Private elevator entry and wraparound terrace.',
    yearBuilt: 2020,
    lotSize: 'N/A',
    propertyType: 'Condo',
    status: 'Active',
    listingDate: '2024-01-05',
    features: ['Penthouse', 'Private Elevator', 'Terrace', 'City Views', 'Bay Views', 'Designer Finishes', 'Concierge']
  },
  {
    id: '6',
    mlsNumber: 'ML81967659',
    address: '888 Sunset Blvd',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94122',
    price: 1650000,
    beds: 3,
    baths: 2,
    sqft: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop'
    ],
    description: 'Move-in ready home in the Inner Sunset. Perfect for families with nearby schools and parks. Updated kitchen, hardwood floors throughout, and bonus room ideal for home office. Large garage with storage.',
    yearBuilt: 1950,
    lotSize: '3,200 sqft',
    propertyType: 'Single Family',
    status: 'Pending',
    listingDate: '2024-01-12',
    features: ['Updated Kitchen', 'Hardwood Floors', 'Bonus Room', 'Garage', 'Storage', 'Near Schools']
  }
];

// Helper function to get properties by status
export function getPropertiesByStatus(status: Property['status']): Property[] {
  return mockProperties.filter(property => property.status === status);
}

// Helper function to get property by ID
export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find(property => property.id === id);
}