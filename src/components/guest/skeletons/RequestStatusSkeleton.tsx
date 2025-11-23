export function RequestStatusSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden animate-pulse">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 py-8">
          {/* Icon Skeleton */}
          <div className="w-14 h-14 bg-gray-200 rounded-full mb-3"></div>

          {/* Title and Message Skeleton */}
          <div className="h-5 bg-gray-200 rounded w-36 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-60 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-52 mb-4"></div>

          {/* Card Skeleton */}
          <div className="bg-white rounded-xl p-3.5 w-full max-w-sm border border-gray-100 mb-3">
            <div className="space-y-1.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="h-9 bg-gray-200 rounded w-36"></div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex flex-col items-center">
          <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

