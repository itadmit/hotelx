export function GuestHomeSkeleton() {
  return (
    <div className="flex flex-col h-full min-h-screen bg-white animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative h-48 bg-gray-200">
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-7 bg-gray-300 rounded w-40 mb-3"></div>
          <div className="h-5 bg-gray-300 rounded-full w-20"></div>
        </div>
      </div>

      {/* Greeting Skeleton */}
      <div className="p-6 pb-2">
        <div className="h-6 bg-gray-200 rounded w-56 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-72"></div>
      </div>

      {/* Categories Grid Skeleton */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl min-h-[160px]"></div>
        ))}
      </div>

      {/* Popular Services Skeleton */}
      <div className="px-6 mt-2 mb-8">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 border border-gray-200">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

