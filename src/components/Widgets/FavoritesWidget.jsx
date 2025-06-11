import React from 'react'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { useLocale } from '../../contexts/LocaleContext'

const FavoritesWidget = ({ onRestaurantSelect }) => {
  const { favorites, removeFromFavorites } = useUserPreferences()
  const { t } = useLocale()

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">❤️</span>
          {t('nav.favorites')}
        </h3>
        <div className="text-center py-6 text-gray-500">
          <span className="text-3xl mb-2 block">💔</span>
          <p className="text-sm">No favorites yet</p>
          <p className="text-xs mt-1">Add restaurants to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-between">
        <span className="flex items-center">
          <span className="mr-2">❤️</span>
          {t('nav.favorites')}
        </span>
        <span className="text-sm text-gray-500">{favorites.length}</span>
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {favorites.slice(0, 5).map(restaurant => (
          <div
            key={restaurant.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => onRestaurantSelect(restaurant)}
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{restaurant.name}</h4>
              <p className="text-xs text-gray-600 capitalize">{restaurant.cuisine}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-yellow-500">⭐</span>
                <span className="text-xs text-gray-600 ml-1">{restaurant.rating}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeFromFavorites(restaurant.id)
              }}
              className="text-red-500 hover:text-red-700 p-1 ml-2"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      
      {favorites.length > 5 && (
        <div className="mt-3 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View all {favorites.length} favorites
          </button>
        </div>
      )}
    </div>
  )
}

export default FavoritesWidget