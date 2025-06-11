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

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    // Sort by rating (high to low), then by name
    if (b.rating !== a.rating) {
      return b.rating - a.rating
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-3 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">📋 Liste</h2>
        <p className="text-sm text-gray-600">
          {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} • Sortiert nach Bewertung
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedRestaurants.map(restaurant => (
          <div 
            key={restaurant.id}
            className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedRestaurant?.id === restaurant.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">{getTypeIcon(restaurant.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        restaurant.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.isOpen ? 'Offen' : 'Geschlossen'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="capitalize">{restaurant.cuisine}</span>
                      <span>•</span>
                      <span>{restaurant.priceRange}</span>
                      <span>•</span>
                      <span>{restaurant.rating} ⭐</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {restaurant.delivery && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      🚚 Lieferung
                    </span>
                  )}
                  {restaurant.takeaway && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      🥡 Abholung
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm">
                  Speisekarte
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {restaurants.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>Keine Restaurants gefunden.</p>
            <p className="text-sm mt-1">Versuche andere Filter oder überprüfe deine Internetverbindung.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantList
