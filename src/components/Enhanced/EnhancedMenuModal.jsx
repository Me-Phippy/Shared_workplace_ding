import React, { useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'

const EnhancedMenuModal = ({ restaurant, onClose }) => {
  const { t, formatCurrency } = useLocale()
  const { addToFavorites, removeFromFavorites, isFavorite } = useUserPreferences()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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
      case '€': return t('price.cheap')
      case '€€': return t('price.moderate')
      case '€€€': return t('price.expensive')
      case '€€€€': return t('price.luxury')
      default: return 'Unknown'
    }
  }

  const toggleFavorite = () => {
    if (isFavorite(restaurant.id)) {
      removeFromFavorites(restaurant.id)
    } else {
      addToFavorites(restaurant)
    }
  }

  // Filter menu items based on search term
  const filteredCategories = restaurant.menu?.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0) || []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite(restaurant.id) 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                {isFavorite(restaurant.id) ? '❤️' : '🤍'}
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-3xl p-2"
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Restaurant Info */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl">{getTypeIcon(restaurant.type)}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="capitalize">{t(`cuisine.${restaurant.cuisine}`)}</span>
                <span>•</span>
                <span>{restaurant.priceRange} ({getPriceRangeText(restaurant.priceRange)})</span>
                <span>•</span>
                <span>{restaurant.rating} ⭐</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  restaurant.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isOpen ? t('status.open') : t('status.closed')}
                </span>
              </div>
            </div>
          </div>

          {restaurant.description && (
            <p className="text-gray-600 mb-4">{restaurant.description}</p>
          )}

          {/* Contact Info */}
          <div className="flex items-center space-x-4 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>{restaurant.phone || 'No phone number'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🕒</span>
              <span>{restaurant.hours || 'Hours not available'}</span>
            </div>
          </div>

          {/* Services */}
          <div className="flex items-center space-x-2 mb-4">
            {restaurant.delivery && (
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                🚚 {t('filter.delivery')}
              </span>
            )}
            {restaurant.takeaway && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                🥡 {t('filter.takeaway')}
              </span>
            )}
          </div>

          {/* Search Bar */}
          {filteredCategories.length > 0 && (
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Menu Content */}
        <div className="p-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-lg">
                {searchTerm ? 'No menu items found' : 'No menu available'}
              </p>
              <p className="text-sm mt-2">
                {searchTerm 
                  ? 'Try a different search term'
                  : 'Contact the restaurant directly for menu information'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category, categoryIndex) => (
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
                          {category.items.length} items
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
                              {formatCurrency(item.price)}
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

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Note</h4>
            <p className="text-sm text-gray-600">
              Prices may vary. Please contact the restaurant directly to confirm current prices and availability.
              {restaurant.delivery && ' Delivery fees may apply.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedMenuModal