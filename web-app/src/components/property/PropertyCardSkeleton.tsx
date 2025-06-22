export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative h-56 w-full bg-gray-300 animate-shimmer flex-shrink-0" />

      {/* Property Details Skeleton */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Price */}
        <div className="flex justify-between items-start mb-2">
          <div className="h-8 w-32 bg-gray-300 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>

        {/* Address */}
        <div className="mb-3">
          <div className="h-5 w-48 bg-gray-200 rounded mb-1" />
          <div className="h-4 w-36 bg-gray-200 rounded" />
        </div>

        {/* Property Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}