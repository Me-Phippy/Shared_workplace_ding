import React from 'react'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'

const RecentSearchesWidget = ({ onSearchSelect }) => {
  const { recentSearches, clearRecentSearches } = useUserPreferences()

  if (recentSearches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🕒</span>
          Recent Searches
        </h3>
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No recent searches</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-between">
        <span className="flex items-center">
          <span className="mr-2">🕒</span>
          Recent Searches
        </span>
        <button
          onClick={clearRecentSearches}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Clear
        </button>
      </h3>
      
      <div className="space-y-2">
        {recentSearches.slice(0, 5).map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchSelect(search.term)}
            className="w-full text-left p-2 bg-gray-50 rounded text-sm hover:bg-gray-100 transition-colors"
          >
            {search.term}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecentSearchesWidget