export function CategoryPageSkeleton() {
  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="relative h-48 bg-gray-200">
        <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
        </div>
      </div>

      {/* Sub-Categories Slider Skeleton */}
      <div className="px-4 pt-4 pb-2 bg-gray-50">
        <div className="flex gap-2 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* Services List Skeleton */}
      <div className="p-4 space-y-4 pb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-row min-h-[140px]">
            <div className="w-32 min-h-[140px] bg-gray-200 shrink-0"></div>
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-md mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

