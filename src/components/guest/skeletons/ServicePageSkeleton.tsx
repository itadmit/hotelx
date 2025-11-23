export function ServicePageSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col animate-pulse">
      {/* Image Header Skeleton */}
      <div className="relative h-56 bg-gray-200">
        <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-gray-300"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="h-7 bg-gray-200 rounded w-48"></div>
          <div className="h-7 bg-gray-200 rounded w-20"></div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

