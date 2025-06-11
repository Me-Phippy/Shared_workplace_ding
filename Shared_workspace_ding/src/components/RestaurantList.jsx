import React from 'react'

const RestaurantList = ({ restaurants, selectedRestaurant, setSelectedRestaurant }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'restaurant': return '🍽️'
      case 'takeaway': return '🥡'
      case 'cafe': return '☕'
      default: return '🏪'
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case 'restaurant': return 'Restaurant'
      case 'takeaway': return 'Takeaway'
      case 'cafe': return 'Café'
      default: return 'Lokal'
    }
  }

  const getPriceRangeText = (priceRange) => {
    switch (priceRange) {
      case '€': return 'Günstig'
      case '€€': return 'Mittel'
      case '€€€': return 'Gehoben'
      case '€€€€': return 'Luxus'
      default: return 'Unbekannt'
    }
  }

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    // Sort by rating (high to low), then by name
    if (b.rating !== a.rating) {
      return b.rating - a.rating
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Restaurantliste</h2>
        <p className="text-sm text-gray-600 mt-1">
          {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} verfügbar • Sortiert nach Bewertung
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedRestaurants.map(restaurant => (
          <div 
            key={restaurant.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedRestaurant?.id === restaurant.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getTypeIcon(restaurant.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        restaurant.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.isOpen ? 'Geöffnet' : 'Geschlossen'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 capitalize">
                      {getTypeText(restaurant.type)} • {restaurant.cuisine}
                    </p>
                  </div>
                </div>
                
                {restaurant.description && (
                  <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
                )}
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Bewertung:</span>
                    <span className="font-semibold">{restaurant.rating}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Preise:</span>
                    <span className="font-semibold">{restaurant.priceRange}</span>
                    <span className="text-xs text-gray-500">
                      ({getPriceRangeText(restaurant.priceRange)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {restaurant.delivery && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      🚚 Lieferung
                    </span>
                  )}
                  {restaurant.takeaway && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      🥡 Abholung
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  <div>📞 {restaurant.phone || 'Keine Telefonnummer'}</div>
                  <div>🕒 {restaurant.hours || 'Öffnungszeiten nicht verfügbar'}</div>
                </div>
              </div>
              
              <div className="ml-4 flex flex-col items-end space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedRestaurant(restaurant)
                  }}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                  📋 Speisekarte
                </button>
                
                {restaurant.lastUpdated && (
                  <span className="text-xs text-gray-400">
                    Aktualisiert: {new Date(restaurant.lastUpdated).toLocaleTimeString('de-DE')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {restaurants.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <span className="text-4xl mb-4 block">🍽️</span>
          <p>Keine Restaurants gefunden</p>
          <p className="text-sm mt-2">Versuche andere Filter oder erweitere deinen Suchbereich</p>
        </div>
      )}
    </div>
  )
}

export default RestaurantList
