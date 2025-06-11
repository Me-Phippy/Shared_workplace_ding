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

  const getPriceRangeText = (priceRange) => {
    switch (priceRange) {
      case '€': return 'Günstig'
      case '€€': return 'Mittel'
      case '€€€': return 'Gehoben'
      case '€€€€': return 'Luxus'
      default: return 'Unbekannt'
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
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Speisekarte</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl"
              aria-label="Schließen"
            >
              ×
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl">{getTypeIcon(restaurant.type)}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="capitalize">{restaurant.cuisine}</span>
                <span>•</span>
                <span>{restaurant.priceRange} ({getPriceRangeText(restaurant.priceRange)})</span>
                <span>•</span>
                <span>{restaurant.rating} ⭐</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  restaurant.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isOpen ? 'Geöffnet' : 'Geschlossen'}
                </span>
              </div>
            </div>
          </div>

          {restaurant.description && (
            <p className="text-gray-600 mb-4">{restaurant.description}</p>
          )}

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>{restaurant.phone || 'Keine Telefonnummer'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🕒</span>
              <span>{restaurant.hours || 'Öffnungszeiten nicht verfügbar'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            {restaurant.delivery && (
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                🚚 Lieferung verfügbar
              </span>
            )}
            {restaurant.takeaway && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                🥡 Abholung möglich
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-lg">Keine Speisekarte verfügbar</p>
              <p className="text-sm mt-2">Kontaktiere das Restaurant direkt für Informationen über das Angebot</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSelectedCategory(
                      selectedCategory === categoryIndex ? null : categoryIndex
                    )}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {category.category}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {category.items.length} Artikel
                        </span>
                        <span className="text-gray-400">
                          {selectedCategory === categoryIndex ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                  </button>
                  
                  {(selectedCategory === categoryIndex || selectedCategory === null) && (
                    <div className="p-6 space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-1">
                              {item.name}
                            </h5>
                            {item.description && (
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Hinweis</h4>
            <p className="text-sm text-gray-600">
              Preise können sich ändern. Bitte kontaktiere das Restaurant direkt, um aktuelle Preise und Verfügbarkeit zu bestätigen.
              {restaurant.delivery && ' Lieferkosten können zusätzlich anfallen.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuModal
