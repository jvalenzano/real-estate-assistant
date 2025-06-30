// components/properties/PropertyCard.tsx

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BedIcon, BathIcon, SquareIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  property: {
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
    images: string[];
    status: 'Active' | 'Pending' | 'In Escrow' | 'Sold';
    listingDate: string;
    propertyType: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  // Calculate days on market
  const daysOnMarket = Math.floor(
    (new Date().getTime() - new Date(property.listingDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative h-64 bg-gray-100">
          {property.images.length > 0 && !imageError ? (
            <>
              <Image
                src={property.images[currentImageIndex]}
                alt={property.address}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority={currentImageIndex === 0}
              />
              
              {/* Image navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {property.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <PropertyStatusBadge status={property.status} />
          </div>
          
          {/* Days on market badge */}
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {daysOnMarket} days
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-2xl font-bold">{formatPrice(property.price)}</h3>
            <p className="text-gray-600">{property.address}</p>
            <p className="text-sm text-gray-500">
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BedIcon className="h-4 w-4" />
              <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="h-4 w-4" />
              <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <SquareIcon className="h-4 w-4" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{property.propertyType}</span>
              <span className="mx-2">•</span>
              <span>MLS# {property.mlsNumber}</span>
            </div>
          </div>

          <Button variant="default" className="w-full" asChild>
            <span>View Details</span>
          </Button>
        </div>
      </Link>
    </Card>
  );
}