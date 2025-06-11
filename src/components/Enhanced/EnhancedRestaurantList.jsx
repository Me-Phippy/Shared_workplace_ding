import React, { useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'

const EnhancedRestaurantList = ({ restaurants, selectedRestaurant, setSelectedRestaurant }) => {
  const { t, formatCurrency } = useLocale()
  const { addToFavorites, removeFromFavorites, isFavorite } = useUserPreferences()
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState('detailed') // 'compact', 'detailed', 'grid'

  const getTypeIcon = (type) => {
    switch (type) {
      case 'restaurant': return '🍽️'
      case 'takeaway': return '🥡'
      case 'cafe': return '☕'
      default: return '🏪'
    }
  }

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return a.priceRange.length - b.priceRange.length
      default:
        return 0
    }
  })

  const toggleFavorite = (restaurant, e) => {
    e.stopPropagation()
    if (isFavorite(restaurant.id)) {
      removeFromFavorites(restaurant.id)
    } else {
      addToFavorites(restaurant)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">{t('nav.list')}</h2>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-200 rounded-md p-1">
              {['compact', 'detailed', 'grid'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'compact' ? '📋' : mode === 'detailed' ? '📄' : '⊞'}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {restaurants.length} {restaurants.length !== 1 ? 'Restaurants' : 'Restaurant'}
          </p>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>
      
      {/* Restaurant List */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4' 
          : 'divide-y divide-gray-200'
        }
      `}>
        {sortedRestaurants.map(restaurant => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            viewMode={viewMode}
            isSelected={selectedRestaurant?.id === restaurant.id}
            isFavorited={isFavorite(restaurant.id)}
            onSelect={() => setSelectedRestaurant(restaurant)}
            onToggleFavorite={(e) => toggleFavorite(restaurant, e)}
            formatCurrency={formatCurrency}
            t={t}
            getTypeIcon={getTypeIcon}
          />
        ))}
      </div>
      
      {restaurants.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <span className="text-4xl mb-4 block">🍽️</span>
          <p>No restaurants found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}

const RestaurantCard = ({ 
  restaurant, 
  viewMode, 
  isSelected, 
  isFavorited, 
  onSelect, 
  onToggleFavorite, 
  formatCurrency,
  t,
  getTypeIcon 
}) => {
  if (viewMode === 'grid') {
    return (
      <div 
        className={`
          bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200
          hover:shadow-md hover:border-blue-300
          ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'}
        `}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(restaurant.type)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{restaurant.cuisine}</p>
            </div>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`p-1 rounded transition-colors ${
              isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Rating:</span>
            <span className="font-medium">{restaurant.rating} ⭐</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">{restaurant.priceRange}</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
            restaurant.isOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {restaurant.isOpen ? t('status.open') : t('status.closed')}
          </div>
        </div>
      </div>
    )
  }

  const cardClasses = viewMode === 'compact' 
    ? 'p-3 hover:bg-gray-50 cursor-pointer transition-colors'
    : 'p-4 hover:bg-gray-50 cursor-pointer transition-colors'

  return (
    <div 
      className={`${cardClasses} ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{getTypeIcon(restaurant.type)}</span>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                <button
                  onClick={onToggleFavorite}
                  className={`transition-colors ${
                    isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  {isFavorited ? '❤️' : '🤍'}
                </button>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  restaurant.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isOpen ? t('status.open') : t('status.closed')}
                </span>
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {t(`type.${restaurant.type}`)} • {t(`cuisine.${restaurant.cuisine}`)}
              </p>
            </div>
          </div>
          
          {viewMode === 'detailed' && (
            <>
              {restaurant.description && (
                <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
              )}
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">{t('common.rating')}:</span>
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-yellow-500">⭐</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-semibold">{restaurant.priceRange}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                {restaurant.delivery && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    🚚 {t('filter.delivery')}
                  </span>
                )}
                {restaurant.takeaway && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    🥡 {t('filter.takeaway')}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500">
                <div>📞 {restaurant.phone || 'No phone number'}</div>
                <div>🕒 {restaurant.hours || 'Hours not available'}</div>
              </div>
            </>
          )}
        </div>
        
        <div className="ml-4 flex flex-col items-end space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            📋 Menu
          </button>
          
          {restaurant.lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated: {new Date(restaurant.lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedRestaurantList