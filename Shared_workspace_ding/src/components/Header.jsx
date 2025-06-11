import React from 'react'

const Header = ({ viewMode, setViewMode, connectionStatus, filters, setFilters }) => {
  const cuisineOptions = [
    { value: '', label: 'Alle Küchen' },
    { value: 'italienisch', label: 'Italienisch' },
    { value: 'japanisch', label: 'Japanisch' },
    { value: 'amerikanisch', label: 'Amerikanisch' },
    { value: 'thailändisch', label: 'Thailändisch' },
    { value: 'türkisch', label: 'Türkisch' },
    { value: 'international', label: 'International' }
  ]

  const typeOptions = [
    { value: '', label: 'Alle Typen' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'takeaway', label: 'Takeaway' },
    { value: 'cafe', label: 'Café' }
  ]
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">🍕 Restaurant Finder</h1>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🗺️ Karte
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Liste
              </button>
            </div>
            
            <select
              value={filters.cuisine}
              onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {cuisineOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <label className="flex items-center space-x-2 text-sm bg-gray-50 px-3 py-1.5 rounded-md">
              <input
                type="checkbox"
                checked={filters.delivery}
                onChange={(e) => setFilters(prev => ({ ...prev, delivery: e.target.checked }))}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Lieferung</span>
            </label>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
