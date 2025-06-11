import React, { useState } from 'react'

const MenuModal = ({ restaurant, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const getTypeIcon = (type) => {
    switch (type) {
      case 'restaurant': return '🍽️'
      case 'takeaway': return '🥡'
      case 'cafe': return '☕'
      default: return '🏪'
    }
  }

  const formatPrice = (price) => {
    return `CHF ${price.toFixed(2)}`
  }

  // Group menu items by category
  const categories = restaurant.menu || []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getTypeIcon(restaurant.type)}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="capitalize">{restaurant.cuisine}</span>
                  <span>•</span>
                  <span>{restaurant.priceRange}</span>
                  <span>•</span>
                  <span>{restaurant.rating} ⭐</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                restaurant.isOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {restaurant.isOpen ? 'Offen' : 'Geschlossen'}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                aria-label="Schließen"
              >
                ×
              </button>
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

        <div className="p-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-lg">Keine Speisekarte verfügbar</p>
              <p className="text-sm mt-2">Kontaktiere das Restaurant direkt für weitere Informationen</p>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                    {category.category}
                  </h3>
                  <div className="grid gap-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="flex items-center space-x-1 mt-2">
                                <span className="text-xs text-gray-500">Allergene:</span>
                                <span className="text-xs text-red-600">{item.allergens.join(', ')}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                            {item.vegetarian && (
                              <div className="text-xs text-green-600 mt-1">🌱 Vegetarisch</div>
                            )}
                            {item.vegan && (
                              <div className="text-xs text-green-600 mt-1">🌿 Vegan</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              {restaurant.phone && (
                <span>📞 {restaurant.phone}</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuModal
