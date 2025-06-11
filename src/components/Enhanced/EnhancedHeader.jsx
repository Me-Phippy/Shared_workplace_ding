import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLocale } from '../../contexts/LocaleContext'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'

const EnhancedHeader = ({ 
  onSidebarToggle, 
  connectionStatus, 
  filters, 
  setFilters,
  searchTerm,
  setSearchTerm 
}) => {
  const { currentTheme } = useTheme()
  const { t } = useLocale()
  const { addToRecentSearches } = useUserPreferences()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      addToRecentSearches(searchTerm.trim())
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <span className="text-xl">☰</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                🍕 Restaurant Finder
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="text-sm text-gray-600">
                  {connectionStatus === 'connected' ? t('status.online') : t('status.offline')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={t('common.search')}
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg transition-all duration-200
                  ${isSearchFocused 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <span className="text-xl">🔔</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <span className="text-xl">👤</span>
            </button>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="mt-3 text-sm text-gray-600">
          <nav className="flex items-center space-x-2">
            <span>🏠</span>
            <span>Home</span>
            <span>›</span>
            <span>Restaurants</span>
            {filters.cuisine && (
              <>
                <span>›</span>
                <span className="capitalize">{t(`cuisine.${filters.cuisine}`)}</span>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default EnhancedHeader