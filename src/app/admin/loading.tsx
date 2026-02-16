export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-64 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
