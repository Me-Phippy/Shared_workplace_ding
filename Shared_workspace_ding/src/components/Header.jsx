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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🍕 Restaurant Finder
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="text-sm text-gray-600">
                {connectionStatus === 'connected' ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🗺️ Karte
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Liste
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="text-sm text-gray-600">
            <p>Entdecke Restaurants, Menüs und Preise in deiner Nähe</p>
          </div>
          
          <div className="flex flex-wrap gap-3 ml-auto">
            <select
              value={filters.cuisine}
              onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <label className="flex items-center space-x-2 text-sm">
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
